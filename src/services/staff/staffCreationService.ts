import { supabase } from "@/lib/supabase";
import { getUserTenantId } from "@/services/base";
import { StaffFormData } from "@/pages/staffy-management/Staff/modals/AddStaffModal";
import {
  isOAuthEmail,
  getOAuthProvider,
  requiresPasswordAuth,
} from "@/services/auth";

/**
 * Service for creating staff members with proper authentication setup
 */
export const staffCreationService = {
  /**
   * Create a new staff member with appropriate auth method
   * - OAuth users (Google/Microsoft): Placeholder user, login with provider
   * - Email/Password users: Create with temporary password, send OTP
   */
  async createStaffMember(formData: StaffFormData) {
    if (!formData.gdprConsent) {
      throw new Error("GDPR consent is required");
    }

    if (!formData.role) {
      throw new Error("Role is required");
    }

    const tenantId = await getUserTenantId();
    const employee_id = `EMP${Date.now()}`;

    // Detect authentication type
    const isOAuth = isOAuthEmail(formData.email);
    const oauthProvider = getOAuthProvider(formData.email);
    const needsPassword = requiresPasswordAuth(formData.email);

    // Generate a secure temporary password for non-OAuth accounts
    const tempPassword = needsPassword
      ? this.generateSecurePassword()
      : undefined;

    // Get current session token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    // Call Edge Function to create auth user
    const { data: authData, error: authError } =
      await supabase.functions.invoke("create-staff-user", {
        body: {
          email: formData.email,
          password: tempPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          isOAuthAccount: isOAuth,
          oauthProvider,
        },
      });

    console.log("Edge Function response:", { authData, authError });

    if (authError || authData?.error) {
      const errorMsg =
        authData?.error || authError?.message || "Failed to create user";
      console.error("Edge Function error:", errorMsg, authData);
      throw new Error(errorMsg);
    }

    const staffId = authData.userId;

    // Create staff record
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

    // Create personal data record
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

    // For password-based auth, send OTP email for first login
    if (needsPassword) {
      await this.sendWelcomeOTP(formData.email);
    }

    return {
      staffData,
      authType: isOAuth ? "oauth" : "password",
      oauthProvider,
      otpSent: needsPassword,
    };
  },

  /**
   * Generate a secure random password
   */
  generateSecurePassword(): string {
    const length = 16;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }
    return password;
  },

  /**
   * Send OTP email to new staff member for first login
   */
  async sendWelcomeOTP(email: string) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        console.error("Failed to send OTP:", error);
        throw new Error("Failed to send welcome email");
      }

      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  },
};
