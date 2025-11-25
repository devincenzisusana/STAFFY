import { supabase } from "@/lib/supabase";
import { getUserTenantId, updateField, deleteItem } from "@/services/base";
import { ScheduleFormData } from "@/components/calendar/modals/ScheduleModal";

export const scheduleService = {
  async fetchAllSchedules() {
    const { data, error } = await supabase
      .from("schedules")
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
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async checkDuplicateSchedule(
    staffId: string,
    startDate: string,
    finishDate: string,
    shiftStart: string,
    shiftEnd: string,
    excludeId?: string
  ) {
    let query = supabase
      .from("schedules")
      .select("id")
      .eq("staff_id", staffId)
      .gte("finish_date", startDate)
      .lte("start_date", finishDate);

    // Exclude current schedule when updating
    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Check if any overlapping schedules have the same time range
    if (data && data.length > 0) {
      const { data: schedules, error: scheduleError } = await supabase
        .from("schedules")
        .select("shift_start, shift_end")
        .in(
          "id",
          data.map((s) => s.id)
        );

      if (scheduleError) throw scheduleError;

      const normalizedShiftStart = shiftStart + ":00";
      const normalizedShiftEnd = shiftEnd + ":00";

      const hasDuplicate = schedules?.some(
        (schedule) =>
          schedule.shift_start === normalizedShiftStart &&
          schedule.shift_end === normalizedShiftEnd
      );

      return hasDuplicate;
    }

    return false;
  },

  async createSchedule(formData: ScheduleFormData) {
    const tenantId = await getUserTenantId();
    const staffIds = Array.isArray(formData.staffMember)
      ? formData.staffMember
      : [formData.staffMember];

    // Create schedule for each staff member
    for (const staffId of staffIds) {
      // Check for duplicates
      const isDuplicate = await this.checkDuplicateSchedule(
        staffId,
        formData.startDate,
        formData.finishDate,
        formData.shiftStart,
        formData.shiftEnd
      );

      if (isDuplicate) {
        throw new Error(
          `A schedule with the same date range and shift times already exists for this staff member.`
        );
      }

      const { error } = await supabase.from("schedules").insert({
        tenant_id: tenantId,
        staff_id: staffId,
        start_date: formData.startDate,
        finish_date: formData.finishDate,
        shift_start: formData.shiftStart + ":00",
        shift_end: formData.shiftEnd + ":00",
        status: formData.scheduleStatus || "scheduled",
        notes: formData.notes || null,
      });

      if (error) throw error;
    }
  },

  async updateSchedule(id: string, formData: ScheduleFormData) {
    const staffId = Array.isArray(formData.staffMember)
      ? formData.staffMember[0]
      : formData.staffMember;

    // Check for duplicates (excluding current schedule)
    const isDuplicate = await this.checkDuplicateSchedule(
      staffId,
      formData.startDate,
      formData.finishDate,
      formData.shiftStart,
      formData.shiftEnd,
      id
    );

    if (isDuplicate) {
      throw new Error(
        "A schedule with the same date range and shift times already exists for this staff member."
      );
    }

    const { error } = await supabase
      .from("schedules")
      .update({
        staff_id: staffId,
        start_date: formData.startDate,
        finish_date: formData.finishDate,
        shift_start: formData.shiftStart + ":00",
        shift_end: formData.shiftEnd + ":00",
        status: formData.scheduleStatus,
        notes: formData.notes || null,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async updateScheduleStatus(id: string, status: string) {
    await updateField("schedules", id, "status", status);
  },

  async deleteSchedule(id: string) {
    await deleteItem("schedules", id);
  },
};
