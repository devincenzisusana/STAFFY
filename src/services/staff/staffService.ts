import { supabase } from "@/lib/supabase";
import { getUserTenantId, updateField } from "@/services/base";
import { StaffFormData } from "@/pages/staffy-management/Staff/modals/AddStaffModal";

export const staffService = {
  async uploadStaffPhoto(staffId: string, file: File): Promise<string> {
    console.log("[staffService.uploadStaffPhoto] START", {
      staffId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const fileExt = file.name.split(".").pop();
    const fileName = `${staffId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("[staffService.uploadStaffPhoto] Uploading to bucket", {
      bucket: "staff-gallery",
      filePath,
    });

    // Upload file to staff-gallery bucket
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("staff-gallery")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    console.log("[staffService.uploadStaffPhoto] Upload response", {
      uploadError,
      uploadData,
    });

    if (uploadError) {
      console.error(
        "[staffService.uploadStaffPhoto] Upload failed:",
        uploadError
      );
      throw uploadError;
    }

    console.log(
      "[staffService.uploadStaffPhoto] Upload successful, getting public URL..."
    );

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("staff-gallery").getPublicUrl(filePath);

    console.log("[staffService.uploadStaffPhoto] Public URL generated", {
      publicUrl,
      filePath,
    });

    if (!publicUrl) {
      throw new Error("Failed to generate public URL for uploaded photo");
    }

    return publicUrl;
  },
  async fetchAllStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select(
        `
        *,
        staff_personal_data (*),
        users!staff_user_id_fkey (role)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createStaffMember(formData: StaffFormData) {
    console.log("[staffService.createStaffMember] START", {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      hasPhoto: !!formData.photo,
    });

    if (!formData.gdprConsent) {
      throw new Error("GDPR consent is required");
    }

    if (!formData.role) {
      throw new Error("Role is required");
    }

    const tenantId = await getUserTenantId();
    const employee_id = `EMP${Date.now()}`;

    console.log("[staffService.createStaffMember] Generated employee_id", {
      employee_id,
      tenantId,
    });

    // Detect if OAuth account (Google or Microsoft)
    const emailLower = formData.email.toLowerCase();
    const isGoogleAuth = emailLower.endsWith("@gmail.com");
    const isMicrosoftAuth =
      emailLower.endsWith("@hotmail.com") ||
      emailLower.endsWith("@outlook.com") ||
      emailLower.endsWith("@live.com") ||
      emailLower.endsWith("@msn.com");
    const isOAuthAccount = isGoogleAuth || isMicrosoftAuth;

    // Generate a temporary password only for non-OAuth accounts
    const tempPassword = isOAuthAccount
      ? undefined
      : `Temp${Math.random().toString(36).slice(-8)}!`;

    console.log("[staffService.createStaffMember] Auth type detected", {
      isOAuthAccount,
      oauthProvider: isGoogleAuth
        ? "google"
        : isMicrosoftAuth
        ? "microsoft"
        : undefined,
    });

    // Get current session token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    console.log(
      "[staffService.createStaffMember] Calling Edge Function to create auth user..."
    );

    // Call Edge Function to create auth user (requires service role)
    const { data: authData, error: authError } =
      await supabase.functions.invoke("create-staff-user", {
        body: {
          email: formData.email,
          password: tempPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          isOAuthAccount,
          oauthProvider: isGoogleAuth
            ? "google"
            : isMicrosoftAuth
            ? "microsoft"
            : undefined,
        },
      });

    console.log("[staffService.createStaffMember] Edge Function response:", {
      authData,
      authError,
    });

    if (authError || authData?.error) {
      const errorMsg =
        authData?.error || authError?.message || "Failed to create user";
      console.error(
        "[staffService.createStaffMember] Edge Function error:",
        errorMsg,
        authData
      );
      throw new Error(errorMsg);
    }

    // Create staff record
    const staffId = authData.userId;

    // Upload photo if provided
    let photoUrl: string | null = null;
    if (formData.photo) {
      try {
        photoUrl = await this.uploadStaffPhoto(staffId, formData.photo);
      } catch (photoError) {
        console.error("Error uploading photo:", photoError);
        // Continue without photo
      }
    }

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
        photo_url: photoUrl,
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
    console.log("[staffService.updateStaffMember] START", {
      timestamp: new Date().toISOString(),
      staffId: id,
      hasPhoto: !!formData.photo,
      photoDetails: formData.photo
        ? {
            name: formData.photo.name,
            size: formData.photo.size,
            type: formData.photo.type,
          }
        : null,
    });

    if (!formData.gdprConsent) {
      throw new Error("GDPR consent is required");
    }

    // First, get the user_id from the staff record
    const { data: staffRecord, error: fetchError } = await supabase
      .from("staff")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !staffRecord) {
      throw new Error("Staff record not found");
    }

    const userId = staffRecord.user_id;
    console.log("[staffService.updateStaffMember] Found user_id", {
      staffId: id,
      userId,
    });

    // Upload photo if provided
    let photoUrl: string | undefined = undefined;
    if (formData.photo) {
      console.log(
        "[staffService.updateStaffMember] Photo detected, starting upload...",
        {
          fileName: formData.photo.name,
          fileSize: formData.photo.size,
          fileType: formData.photo.type,
          isFile: formData.photo instanceof File,
          userId,
          timestamp: new Date().toISOString(),
        }
      );
      try {
        const uploadStart = performance.now();
        console.log(
          "[staffService.updateStaffMember] Calling uploadStaffPhoto with userId:",
          userId
        );
        photoUrl = await this.uploadStaffPhoto(userId, formData.photo);
        const uploadEnd = performance.now();
        console.log("[staffService.updateStaffMember] Photo upload COMPLETED", {
          photoUrl,
          duration: `${(uploadEnd - uploadStart).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });
      } catch (photoError) {
        console.error(
          "[staffService.updateStaffMember] Error uploading photo:",
          photoError
        );
        // Continue without updating photo
      }
    }

    // Update staff table
    const updateData: any = {
      email: formData.email,
      position: formData.position,
      department: formData.department,
      hire_date: formData.hireDate,
    };

    if (photoUrl) {
      updateData.photo_url = photoUrl;
      console.log(
        "[staffService.updateStaffMember] ✅ photo_url ADDED to updateData",
        {
          photo_url: photoUrl,
        }
      );
    } else {
      console.log(
        "[staffService.updateStaffMember] ⚠️ NO photo_url to save (photoUrl is undefined)"
      );
    }

    console.log("[staffService.updateStaffMember] Final updateData object:", {
      staffId: id,
      updateData: JSON.stringify(updateData, null, 2),
      timestamp: new Date().toISOString(),
    });

    const staffUpdateStart = performance.now();
    const { data: updatedStaff, error: staffError } = await supabase
      .from("staff")
      .update(updateData)
      .eq("id", id)
      .select();
    const staffUpdateEnd = performance.now();

    console.log("[staffService.updateStaffMember] Staff table update result", {
      duration: `${(staffUpdateEnd - staffUpdateStart).toFixed(2)}ms`,
      error: staffError,
      updatedData: updatedStaff,
      timestamp: new Date().toISOString(),
    });

    if (staffError) throw staffError;

    // Update role in users table using the correct user_id
    if (formData.role) {
      console.log(
        "[staffService.updateStaffMember] Updating role in users table...",
        {
          userId,
          newRole: formData.role,
          timestamp: new Date().toISOString(),
        }
      );
      const roleUpdateStart = performance.now();
      const { error: roleError } = await supabase
        .from("users")
        .update({ role: formData.role })
        .eq("id", userId);
      const roleUpdateEnd = performance.now();
      console.log("[staffService.updateStaffMember] Role updated", {
        duration: `${(roleUpdateEnd - roleUpdateStart).toFixed(2)}ms`,
        error: roleError,
        timestamp: new Date().toISOString(),
      });
      if (roleError) {
        console.error(
          "[staffService.updateStaffMember] Role update error:",
          roleError
        );
      }
    }

    // Update staff_personal_data table
    console.log(
      "[staffService.updateStaffMember] Updating staff_personal_data table...",
      {
        staffId: id,
        timestamp: new Date().toISOString(),
      }
    );

    const personalDataStart = performance.now();
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
    const personalDataEnd = performance.now();

    console.log("[staffService.updateStaffMember] Personal data updated", {
      duration: `${(personalDataEnd - personalDataStart).toFixed(2)}ms`,
      error: personalError,
      timestamp: new Date().toISOString(),
    });

    if (personalError) throw personalError;

    console.log("[staffService.updateStaffMember] COMPLETED SUCCESSFULLY", {
      timestamp: new Date().toISOString(),
      staffId: id,
      userId,
    });
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
