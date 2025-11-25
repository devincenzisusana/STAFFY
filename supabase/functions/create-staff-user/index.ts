import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the requesting user is authenticated
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError?.message }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Check if user has admin role before allowing user creation
    // const { data: userData } = await supabaseAdmin
    //   .from("users")
    //   .select("role")
    //   .eq("id", user.id)
    //   .single();
    // if (userData?.role !== "admin") {
    //   return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
    //     status: 403,
    //     headers: { ...corsHeaders, "Content-Type": "application/json" },
    //   });
    // }

    const { email, password, firstName, lastName, role, isGoogleAuth } =
      await req.json();

    if (!email || !firstName || !lastName || !role) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          received: {
            email: !!email,
            firstName: !!firstName,
            lastName: !!lastName,
            role: !!role,
          },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For Google auth users, return a placeholder ID
    // The actual auth user will be created when they sign in with Google
    let userId;

    if (isGoogleAuth) {
      // For Gmail users: create a placeholder auth user that will be replaced on first Google sign-in
      userId = crypto.randomUUID();

      // Create placeholder auth user (this satisfies the foreign key constraint)
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: false, // Not confirmed since they haven't signed in yet
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            is_google_placeholder: true, // Mark as placeholder
          },
        });

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      userId = authData.user.id;

      // Get tenant_id from the requesting user
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      const tenantId = userData?.tenant_id;

      if (!tenantId) {
        // Rollback: delete the placeholder auth user
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return new Response(
          JSON.stringify({ error: "Unable to determine tenant_id" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Create users record
      const { error: usersError } = await supabaseAdmin.from("users").insert({
        id: userId,
        tenant_id: tenantId,
        email,
        role: role === "admin" ? "admin-operator" : "staff-operator",
      });

      if (usersError) {
        // Rollback: delete the placeholder auth user
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return new Response(JSON.stringify({ error: usersError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          userId,
          email,
          isGoogleAuth: true,
          message:
            "Staff record can be created. User will authenticate via Google on first login.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For email/password users: create auth user with password
    if (!password) {
      return new Response(
        JSON.stringify({ error: "Password required for non-Google auth" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: authData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    userId = authData.user.id;

    // Update user role in users table

    const { error: roleError } = await supabaseAdmin
      .from("users")
      .update({ role })
      .eq("id", userId);

    if (roleError) {
      // Rollback: delete the created auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({
          error: "Failed to update role",
          details: roleError.message,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        userId,
        email,
        isGoogleAuth: false,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("=== Edge Function Error ===", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage, type: error?.constructor?.name }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
