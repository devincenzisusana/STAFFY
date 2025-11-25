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
    console.log("=== Delete Staff User Function Started ===");

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

    console.log("Supabase admin client created");

    // Verify the requesting user is authenticated
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);

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

    console.log("User authenticated:", !!user, "Error:", authError?.message);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError?.message }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Check if user has admin role before allowing deletion
    // const { data: userData } = await supabaseAdmin
    //   .from("users")
    //   .select("role")
    //   .eq("id", user.id)
    //   .single();
    // if (userData?.role !== "admin-operator") {
    //   return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
    //     status: 403,
    //     headers: { ...corsHeaders, "Content-Type": "application/json" },
    //   });
    // }

    const { userId } = await req.json();

    console.log("Request to delete user:", userId);

    if (!userId) {
      console.log("Missing userId");
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get staff info before deletion for logging
    const { data: staffData } = await supabaseAdmin
      .from("staff")
      .select("email, user_id")
      .eq("user_id", userId)
      .single();

    console.log("Staff to delete:", staffData);

    // Delete from staff_personal_data (if foreign key cascade doesn't handle it)
    const { error: personalError } = await supabaseAdmin
      .from("staff_personal_data")
      .delete()
      .eq("staff_id", staffData?.id);

    if (personalError) {
      console.log("Error deleting staff_personal_data:", personalError);
      // Continue anyway as it might not exist
    }

    // Delete from staff table
    const { error: staffError } = await supabaseAdmin
      .from("staff")
      .delete()
      .eq("user_id", userId);

    if (staffError) {
      console.log("Error deleting staff:", staffError);
      return new Response(
        JSON.stringify({
          error: "Failed to delete staff record",
          details: staffError.message,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Staff record deleted");

    // Delete from users table (should cascade from auth deletion, but doing it explicitly)
    const { error: usersError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (usersError) {
      console.log("Error deleting users record:", usersError);
      // Continue anyway as cascade might handle it
    }

    console.log("Users record deleted");

    // Delete from auth.users (this is the key part that requires admin access)
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.log("Error deleting auth user:", authDeleteError);
      return new Response(
        JSON.stringify({
          error: "Failed to delete auth user",
          details: authDeleteError.message,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Auth user deleted successfully");

    console.log("=== Delete Staff User Function Success ===");

    return new Response(
      JSON.stringify({
        success: true,
        message: "User deleted successfully from all tables",
        deletedEmail: staffData?.email,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("=== Delete Staff User Function Error ===", error);
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
