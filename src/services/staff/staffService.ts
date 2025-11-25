import { supabase } from "@/lib/supabase";
import { getUserTenantId, updateField } from "@/services/base";
import { StaffFormData } from "@/pages/staffy-management/Staff/modals/AddStaffModal";

export const staffService = {
  async fetchAllStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select(
        `
        *,
        staff_personal_data (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createStaffMember(formData: StaffFormData) {
    if (!formData.gdprConsent) {
      throw new Error("GDPR consent is required");
    }

    if (!formData.role) {
      throw new Error("Role is required");
    }

    const tenantId = await getUserTenantId();
    const employee_id = `EMP${Date.now()}`;

    // Detect if Gmail/Google account
    const isGoogleAuth = formData.email.toLowerCase().endsWith("@gmail.com");

    // Generate a temporary password only for non-Google accounts
    const tempPassword = isGoogleAuth
      ? undefined
      : `Temp${Math.random().toString(36).slice(-8)}!`;

    // Get current session token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    // Call Edge Function to create auth user (requires service role)
    const { data: authData, error: authError } =
      await supabase.functions.invoke("create-staff-user", {
        body: {
          email: formData.email,
          password: tempPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          isGoogleAuth,
        },
      });

    console.log("Edge Function response:", { authData, authError });

    if (authError || authData?.error) {
      const errorMsg =
        authData?.error || authError?.message || "Failed to create user";
      console.error("Edge Function error:", errorMsg, authData);
      throw new Error(errorMsg);
    }

    // Create staff record
    // For Google users: use placeholder ID, will be linked on first login
    // For email/password: use auth user ID
    const staffId = authData.userId;

    const { data: staffData, error: staffError } = await supabase
      .from("staff")
      .insert({
        user_id: staffId,
        tenant_id: tenantId,
        employee_id,
        email: formData.email,
        position: formData.position,
        department: formData.department,
        hire_date: formData.hireDate || new Date().toISOString().split("T")[0],
        status: "active",
      })
      .select()
      .single();

    if (staffError) throw staffError;

    const { error: personalError } = await supabase
      .from("staff_personal_data")
      .insert({
        staff_id: staffData.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        id_number: formData.idNumber,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
        country: formData.country,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_number: formData.emergencyContactNumber,
        gdpr_consent_given: true,
        gdpr_consent_date: new Date().toISOString(),
      });

    if (personalError) throw personalError;

    // TODO: Send email with temporary password to formData.email
  },

  async updateStaffMember(id: string, formData: StaffFormData) {
    if (!formData.gdprConsent) {
      throw new Error("GDPR consent is required");
    }

    // Update staff table
    const { error: staffError } = await supabase
      .from("staff")
      .update({
        email: formData.email,
        position: formData.position,
        department: formData.department,
        hire_date: formData.hireDate,
      })
      .eq("id", id);

    if (staffError) throw staffError;

    // Update role in users table (requires RLS policy allowing role updates)
    if (formData.role) {
      await supabase.from("users").update({ role: formData.role }).eq("id", id);
    }

    // Update staff_personal_data table
    const { error: personalError } = await supabase
      .from("staff_personal_data")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        id_number: formData.idNumber,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
        country: formData.country,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_number: formData.emergencyContactNumber,
      })
      .eq("staff_id", id);

    if (personalError) throw personalError;
  },

  async updateStaffStatus(id: string, status: string) {
    await updateField("staff", id, "status", status);
  },

  async deleteStaffMember(id: string) {
    // Get user_id from staff table
    const { data: staffData } = await supabase
      .from("staff")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!staffData?.user_id) {
      throw new Error("Staff member not found or no user_id");
    }

    // Call Edge Function to delete user from auth and cascade delete
    const { data, error } = await supabase.functions.invoke(
      "delete-staff-user",
      {
        body: {
          userId: staffData.user_id,
        },
      }
    );

    if (error || data?.error) {
      const errorMsg = data?.error || error?.message || "Failed to delete user";
      console.error("Edge Function delete error:", errorMsg, data);
      throw new Error(errorMsg);
    }
  },
};
