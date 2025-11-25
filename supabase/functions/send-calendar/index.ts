import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCalendarRequest {
  staffMemberIds: string[];
  statuses: string[];
  message: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface Schedule {
  id: string;
  staff_id: string;
  start_date: string;
  finish_date: string;
  shift_start: string;
  shift_end: string;
  location: string;
  role: string;
  notes: string;
  status: string;
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

// Generate mobile-responsive HTML email template
function generateEmailHTML(
  tenantName: string,
  staffName: string,
  schedules: Schedule[],
  message: string
): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDateRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (startStr === endStr) {
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }

    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    scheduled: { bg: "#FFF3CD", text: "#856404" },
    confirmed: { bg: "#D4EDDA", text: "#155724" },
    cancelled: { bg: "#F8D7DA", text: "#721C24" },
    completed: { bg: "#D1ECF1", text: "#0C5460" },
  };

  const scheduleRows = schedules
    .map((schedule) => {
      const statusStyle = statusColors[schedule.status] || {
        bg: "#F5F5F5",
        text: "#616161",
      };

      return `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #E0E0E0; font-family: Arial, sans-serif; vertical-align: top;">
          <div style="color: #424242; font-size: 14px; font-weight: 600; line-height: 1.4;">
            ${formatDateRange(schedule.start_date, schedule.finish_date)}
          </div>
          ${
            schedule.notes
              ? `<div style="color: #666666; font-size: 13px; line-height: 1.4; margin-top: 4px;">${schedule.notes}</div>`
              : ""
          }
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #E0E0E0; font-family: Arial, sans-serif; vertical-align: top;">
          <div style="color: #424242; font-size: 14px; line-height: 1.4;">
            ${formatTime(schedule.shift_start)} - ${formatTime(
        schedule.shift_end
      )}
          </div>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #E0E0E0; font-family: Arial, sans-serif; text-align: right; vertical-align: top;">
          <span style="display: inline-block; padding: 4px 12px; background-color: ${
            statusStyle.bg
          }; color: ${
        statusStyle.text
      }; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            ${schedule.status}
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
  <title>Work Schedule</title>
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
          
          <!-- Header with Venue Name -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 24px 20px 20px 20px; text-align: center; border-bottom: 1px solid #E0E0E0;">
              <h1 style="margin: 0; color: #212121; font-size: 20px; font-weight: 600; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 2px; line-height: 1.3;">
                ${tenantName}
              </h1>
              <p style="margin: 8px 0 0 0; color: #666666; font-size: 13px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                Work Schedule - Next 30 Days
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
          
          <!-- Schedule Table Header -->
          <tr>
            <td style="padding: 16px 20px 0 20px; background-color: #FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E0E0E0;">
                <thead>
                  <tr style="background-color: #F8F9FA;">
                    <th style="padding: 12px 16px; text-align: left; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E0E0E0; width: 30%;">
                      Date Range
                    </th>
                    <th style="padding: 12px 16px; text-align: left; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E0E0E0; width: 40%;">
                      Shift Time
                    </th>
                    <th style="padding: 12px 16px; text-align: right; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E0E0E0; width: 30%;">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${scheduleRows}
                </tbody>
              </table>
            </td>
          </tr>
          
          <!-- Important Reminders -->
          <tr>
            <td style="padding: 20px 20px 16px 20px; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600;">
                Important Reminders:
              </p>
              <ul style="margin: 0; padding: 0 0 0 20px; color: #424242; font-size: 13px; font-family: Arial, sans-serif; line-height: 1.8;">
                <li style="margin-bottom: 6px;">Please arrive 15 minutes before your scheduled shift</li>
                <li style="margin-bottom: 6px;">Contact your supervisor immediately if you cannot make a scheduled shift</li>
                <li style="margin-bottom: 6px;">Check your schedule regularly for any updates or changes</li>
                <li>Confirm your shifts through the hotel management system</li>
              </ul>
            </td>
          </tr>
          
          <!-- Closing -->
          <tr>
            <td style="padding: 0 20px 20px 20px; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0; color: #424242; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                Thank you for your continued dedication to providing excellent service. If you have any questions about your schedule, please don't hesitate to contact management.
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
    console.log("=== Send Calendar Function Started ===");

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
    const requestData: SendCalendarRequest = await req.json();
    const { staffMemberIds, statuses, message, dateRange } = requestData;

    if (
      !staffMemberIds ||
      staffMemberIds.length === 0 ||
      !statuses ||
      statuses.length === 0
    ) {
      throw new Error("Staff members and statuses are required");
    }

    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Fetch schedules for selected staff members and statuses
    let query = supabaseClient
      .from("schedules")
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
      .in("status", statuses)
      .order("start_date", { ascending: true })
      .order("shift_start", { ascending: true });

    // Apply date range filter if provided
    if (dateRange?.start) {
      query = query.gte("start_date", dateRange.start);
    }
    if (dateRange?.end) {
      query = query.lte("finish_date", dateRange.end);
    }

    const { data: schedules, error: schedulesError } = await query;

    if (schedulesError) {
      throw schedulesError;
    }

    if (!schedules || schedules.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No schedules found for the selected criteria",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Group schedules by staff member
    const schedulesByStaff = schedules.reduce((acc, schedule: any) => {
      const staffId = schedule.staff_id;
      if (!acc[staffId]) {
        acc[staffId] = [];
      }
      acc[staffId].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);

    // Send emails to each staff member
    const emailPromises = Object.entries(schedulesByStaff).map(
      async ([staffId, staffSchedules]) => {
        const firstSchedule = staffSchedules[0];
        const staffData = firstSchedule.staff;
        const personalData = staffData?.staff_personal_data;

        if (!staffData?.email) {
          console.error(`No email found for staff ID: ${staffId}`);
          return { success: false, staffId, error: "No email address" };
        }

        const staffName = personalData
          ? `${personalData.first_name} ${personalData.last_name}`
          : "Staff Member";
        const tenantName = staffData?.tenant?.name || "Hotel";
        const emailHTML = generateEmailHTML(
          tenantName,
          staffName,
          staffSchedules,
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
            subject: `Your Schedule - ${staffSchedules.length} shift${
              staffSchedules.length > 1 ? "s" : ""
            }`,
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
        totalSchedules: schedules.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-calendar function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
