import { supabase } from "@/lib/supabase";
import { getUserTenantId, updateField, deleteItem } from "@/services/base";
import { AbsenceFormData } from "@/pages/staffy-management/Absence/modals/CreateAbsenceModal";

export const absenceService = {
  async fetchAllAbsenceRequests() {
    const { data, error } = await supabase
      .from("absence_requests")
      .select(
        `
        *,
        staff:staff_id (
          id,
          employee_id,
          staff_personal_data (
            first_name,
            last_name
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAbsenceRequest(formData: AbsenceFormData) {
    const tenantId = await getUserTenantId();

    const { error } = await supabase.from("absence_requests").insert({
      tenant_id: tenantId,
      staff_id: formData.staffMember,
      request_type: formData.requestType,
      start_date: formData.startDate,
      end_date: formData.endDate,
      notes: formData.notes || null,
      status: "pending",
    });

    if (error) throw error;
  },

  async updateAbsenceRequest(id: string, formData: AbsenceFormData) {
    const { error } = await supabase
      .from("absence_requests")
      .update({
        staff_id: formData.staffMember,
        request_type: formData.requestType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        notes: formData.notes || null,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async updateAbsenceStatus(id: string, status: string) {
    await updateField("absence_requests", id, "status", status);
  },

  async deleteAbsenceRequest(id: string) {
    await deleteItem("absence_requests", id);
  },
};
