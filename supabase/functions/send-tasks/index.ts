import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendTasksRequest {
  staffMemberIds: string[];
  priorities: string[];
  statuses: string[];
  message: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  due_date: string | null;
  due_time: string | null;
  status: string;
  created_at: string;
  staff: {
    email: string;
    tenant: {
      name: string;
    };
    staff_personal_data: {
      first_name: string;
      last_name: string;
    };
  };
}

// Generate mobile-responsive HTML email template for tasks
function generateTaskEmailHTML(
  tenantName: string,
  staffName: string,
  tasks: Task[],
  message: string
): string {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No deadline";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const priorityColors: Record<string, { bg: string; text: string }> = {
    low: { bg: "#E3F2FD", text: "#1565C0" },
    medium: { bg: "#FFF3CD", text: "#856404" },
    high: { bg: "#FFE0B2", text: "#E65100" },
    urgent: { bg: "#FFCDD2", text: "#C62828" },
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "#FFF3CD", text: "#856404" },
    "in-progress": { bg: "#D1ECF1", text: "#0C5460" },
    completed: { bg: "#D4EDDA", text: "#155724" },
    cancelled: { bg: "#F8D7DA", text: "#721C24" },
  };

  const taskRows = tasks
    .map((task) => {
      const priorityStyle = priorityColors[task.priority] || {
        bg: "#F5F5F5",
        text: "#616161",
      };
      const statusStyle = statusColors[task.status] || {
        bg: "#F5F5F5",
        text: "#616161",
      };

      const deadline = task.due_date
        ? `${formatDate(task.due_date)}${
            task.due_time ? ` at ${formatTime(task.due_time)}` : ""
          }`
        : "No deadline";

      return `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #E0E0E0; font-family: Arial, sans-serif; vertical-align: top;">
          <div style="color: #212121; font-size: 15px; font-weight: 600; line-height: 1.4; margin-bottom: 4px;">
            ${task.title}
          </div>
          ${
            task.category
              ? `<div style="color: #666666; font-size: 12px; line-height: 1.4; margin-bottom: 4px;">
              <span style="display: inline-block; padding: 2px 8px; background-color: #F5F5F5; border-radius: 3px;">${task.category}</span>
            </div>`
              : ""
          }
          ${
            task.description
              ? `<div style="color: #757575; font-size: 13px; line-height: 1.5; margin-top: 6px;">${task.description}</div>`
              : ""
          }
          <div style="color: #666666; font-size: 12px; line-height: 1.4; margin-top: 8px;">
            📅 ${deadline}
          </div>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #E0E0E0; font-family: Arial, sans-serif; text-align: center; vertical-align: top; white-space: nowrap;">
          <span style="display: inline-block; padding: 4px 10px; background-color: ${
            priorityStyle.bg
          }; color: ${
        priorityStyle.text
      }; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            ${task.priority}
          </span>
          <br>
          <span style="display: inline-block; padding: 4px 10px; background-color: ${
            statusStyle.bg
          }; color: ${
        statusStyle.text
      }; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: capitalize; letter-spacing: 0.5px;">
            ${task.status.replace("-", " ")}
          </span>
        </td>
      </tr>
    `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="format-detection" content="date=no">
  <meta name="format-detection" content="address=no">
  <meta name="format-detection" content="email=no">
  <title>Task Assignment</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- Outer wrapper for email clients -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F5F5; padding: 20px 0; min-width: 100%;">
    <tr>
      <td align="center" style="padding: 0 10px;">
        
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; min-width: 280px; background-color: #FFFFFF; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 24px 20px 20px 20px; text-align: center; border-bottom: 1px solid #E0E0E0;">
              <h1 style="margin: 0; color: #212121; font-size: 20px; font-weight: 600; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 2px; line-height: 1.3;">
                ${tenantName}
              </h1>
              <p style="margin: 8px 0 0 0; color: #666666; font-size: 13px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                Your Task Assignments
              </p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 24px 20px 16px 20px; background-color: #FFFFFF;">
              <p style="margin: 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                Dear ${staffName},
              </p>
            </td>
          </tr>
          
          ${
            message
              ? `
          <!-- Custom Message -->
          <tr>
            <td style="padding: 0 20px 16px 20px; background-color: #FFFFFF;">
              <p style="margin: 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                ${message}
              </p>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- Task Summary -->
          <tr>
            <td style="padding: 0 20px 16px 20px; background-color: #FFFFFF;">
              <p style="margin: 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                You have <strong>${tasks.length} task${
    tasks.length !== 1 ? "s" : ""
  }</strong> assigned to you:
              </p>
            </td>
          </tr>
          
          <!-- Task Table -->
          <tr>
            <td style="padding: 0 20px 16px 20px; background-color: #FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E0E0E0;">
                <thead>
                  <tr style="background-color: #F8F9FA;">
                    <th style="padding: 12px 16px; text-align: left; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E0E0E0; width: 65%;">
                      Task Details
                    </th>
                    <th style="padding: 12px 16px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E0E0E0; width: 35%;">
                      Priority & Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${taskRows}
                </tbody>
              </table>
            </td>
          </tr>
          
          <!-- Important Notes -->
          <tr>
            <td style="padding: 20px 20px 16px 20px; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600;">
                Important Notes:
              </p>
              <ul style="margin: 0; padding: 0 0 0 20px; color: #424242; font-size: 13px; font-family: Arial, sans-serif; line-height: 1.8;">
                <li style="margin-bottom: 6px;">Update task status as you progress through the management system</li>
                <li style="margin-bottom: 6px;">Contact your supervisor if you need clarification on any task</li>
                <li style="margin-bottom: 6px;">Prioritize urgent tasks and those with approaching deadlines</li>
                <li>Mark tasks as completed once finished for accurate tracking</li>
              </ul>
            </td>
          </tr>
          
          <!-- Closing -->
          <tr>
            <td style="padding: 0 20px 20px 20px; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                Thank you for your dedication and hard work. If you have any questions about these tasks, please don't hesitate to reach out to management.
              </p>
              <p style="margin: 0 0 4px 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                Best regards,
              </p>
              <p style="margin: 0 0 2px 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600; line-height: 1.6;">
                Management Team
              </p>
              <p style="margin: 0; color: #666666; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                ${tenantName}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 20px; background-color: #F8F9FA; text-align: center; border-top: 1px solid #E0E0E0;">
              <p style="margin: 0 0 4px 0; color: #666666; font-size: 11px; font-family: Arial, sans-serif; line-height: 1.4;">
                © 2025 Staffy Management System. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("=== Send Tasks Function Started ===");

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No authorization header",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Create Supabase client for auth verification
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      console.error("Auth verification failed:", userError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized - please sign in",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    console.log("User authenticated:", user.email);

    // Create Supabase client for data queries
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Parse request body
    const requestData: SendTasksRequest = await req.json();
    console.log("Received request data:", JSON.stringify(requestData, null, 2));

    const { staffMemberIds, priorities, statuses, message } = requestData;

    if (
      !staffMemberIds ||
      staffMemberIds.length === 0 ||
      !priorities ||
      priorities.length === 0 ||
      !statuses ||
      statuses.length === 0
    ) {
      const errorMsg = `Validation failed - staffMembers: ${
        staffMemberIds?.length || 0
      }, priorities: ${priorities?.length || 0}, statuses: ${
        statuses?.length || 0
      }`;
      console.error(errorMsg);
      throw new Error("Staff members, priorities, and statuses are required");
    }

    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Fetch tasks for selected staff members, priorities, and statuses
    const { data: tasks, error: tasksError } = await supabaseClient
      .from("tasks")
      .select(
        `
        *,
        staff:staff_id (
          email,
          tenant:tenant_id (
            name
          ),
          staff_personal_data (
            first_name,
            last_name
          )
        )
      `
      )
      .in("staff_id", staffMemberIds)
      .in("priority", priorities)
      .in("status", statuses)
      .order("priority", { ascending: false })
      .order("due_date", { ascending: true });

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }

    console.log(`Found ${tasks?.length || 0} tasks matching criteria`);

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "No tasks found matching the selected criteria. Please adjust your filters and try again.",
          totalTasks: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Group tasks by staff member
    const tasksByStaff = tasks.reduce((acc, task: any) => {
      const staffId = task.staff_id;
      if (!acc[staffId]) {
        acc[staffId] = [];
      }
      acc[staffId].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    // Send emails to each staff member
    const emailPromises = Object.entries(tasksByStaff).map(
      async ([staffId, staffTasks]) => {
        const firstTask = staffTasks[0];
        const staffData = firstTask.staff;
        const personalData = staffData?.staff_personal_data;

        if (!staffData?.email) {
          console.error(`No email found for staff ID: ${staffId}`);
          return { success: false, staffId, error: "No email address" };
        }

        const staffName = personalData
          ? `${personalData.first_name} ${personalData.last_name}`
          : "Staff Member";
        const tenantName = staffData?.tenant?.name || "Hotel";
        const emailHTML = generateTaskEmailHTML(
          tenantName,
          staffName,
          staffTasks,
          message
        );

        // Send email via Resend
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Staffy Management <no-reply@elviradc.com>",
            to: [staffData.email],
            subject: `Your Tasks - ${staffTasks.length} task${
              staffTasks.length > 1 ? "s" : ""
            } assigned`,
            html: emailHTML,
          }),
        });

        if (!resendResponse.ok) {
          const errorText = await resendResponse.text();
          console.error(
            `Failed to send email to ${staffData.email}:`,
            errorText
          );
          return {
            success: false,
            staffId,
            email: staffData.email,
            error: errorText,
          };
        }

        const resendData = await resendResponse.json();
        return {
          success: true,
          staffId,
          email: staffData.email,
          emailId: resendData.id,
        };
      }
    );

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully sent ${successCount} email${
          successCount !== 1 ? "s" : ""
        }${failureCount > 0 ? `, ${failureCount} failed` : ""}`,
        totalTasks: tasks.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-tasks function:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
