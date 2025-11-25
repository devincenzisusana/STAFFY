import { supabase } from "@/lib/supabase";

/**
 * Time Control Service
 * Handles all time tracking operations including clock-in, clock-out, and time entry management
 */

export interface TimeEntryData {
  staff_id: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  break_duration?: string;
}

export interface TimeEntryUpdateData {
  clock_out?: string;
  break_duration?: string;
}

export interface TimeEntryWithStaff {
  id: string;
  tenant_id: string;
  staff_id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  break_duration: string | null;
  total_hours: number | null;
  overtime_hours: number | null;
  created_at: string;
  updated_at: string;
  employee_id: string;
  staff_email: string;
  position: string;
  department: string;
  staff_name: string;
  first_name: string;
  last_name: string;
}

export const timeControlService = {
  /**
   * Fetch all time entries for the current tenant
   * @param filters Optional filters for date range and staff
   */
  async fetchAllTimeEntries(filters?: {
    startDate?: string;
    endDate?: string;
    staffId?: string;
  }) {
    let query = supabase
      .from("time_entries_with_staff")
      .select("*")
      .order("date", { ascending: false })
      .order("clock_in", { ascending: false });

    // Apply filters
    if (filters?.startDate) {
      query = query.gte("date", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("date", filters.endDate);
    }
    if (filters?.staffId) {
      query = query.eq("staff_id", filters.staffId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as TimeEntryWithStaff[];
  },

  /**
   * Fetch time entries for a specific staff member
   */
  async fetchTimeEntriesByStaff(
    staffId: string,
    startDate?: string,
    endDate?: string
  ) {
    return this.fetchAllTimeEntries({ staffId, startDate, endDate });
  },

  /**
   * Check if staff already has a time entry for a specific date
   */
  async hasEntryForDate(staffId: string, date: string) {
    const { data, error } = await supabase
      .from("time_entries")
      .select("id")
      .eq("staff_id", staffId)
      .eq("date", date)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  },

  /**
   * Clock in - Create a new time entry
   */
  async clockIn(data: TimeEntryData) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: userData } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!userData) throw new Error("User data not found");

    // Check if staff already has an entry for this date
    const hasEntry = await this.hasEntryForDate(data.staff_id, data.date);
    if (hasEntry) {
      throw new Error(
        "Staff member already has a time entry for this date. Only one entry per day is allowed."
      );
    }

    const { data: timeEntry, error } = await supabase
      .from("time_entries")
      .insert({
        tenant_id: userData.tenant_id,
        staff_id: data.staff_id,
        date: data.date,
        clock_in: data.clock_in,
      })
      .select()
      .single();

    if (error) throw error;
    return timeEntry;
  },

  /**
   * Clock out - Update existing time entry with clock out time
   */
  async clockOut(entryId: string, data: TimeEntryUpdateData) {
    const { data: timeEntry, error } = await supabase
      .from("time_entries")
      .update({
        clock_out: data.clock_out,
        break_duration: data.break_duration,
      })
      .eq("id", entryId)
      .select()
      .single();

    if (error) throw error;
    return timeEntry;
  },

  /**
   * Update a time entry (for corrections or manual entry)
   */
  async updateTimeEntry(entryId: string, data: TimeEntryUpdateData) {
    const { data: timeEntry, error } = await supabase
      .from("time_entries")
      .update(data)
      .eq("id", entryId)
      .select()
      .single();

    if (error) throw error;
    return timeEntry;
  },

  /**
   * Delete a time entry
   */
  async deleteTimeEntry(entryId: string) {
    const { error } = await supabase
      .from("time_entries")
      .delete()
      .eq("id", entryId);

    if (error) throw error;
  },

  /**
   * Get active (clocked-in) entry for a staff member
   */
  async getActiveEntry(staffId: string) {
    const { data, error } = await supabase
      .from("time_entries")
      .select("*")
      .eq("staff_id", staffId)
      .is("clock_out", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data;
  },

  /**
   * Calculate total hours worked for a staff member in a date range
   */
  async calculateTotalHours(
    staffId: string,
    startDate: string,
    endDate: string
  ) {
    const { data, error } = await supabase
      .from("time_entries")
      .select("total_hours, overtime_hours")
      .eq("staff_id", staffId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    const totals = data.reduce(
      (acc, entry) => ({
        totalHours: acc.totalHours + (entry.total_hours || 0),
        overtimeHours: acc.overtimeHours + (entry.overtime_hours || 0),
      }),
      { totalHours: 0, overtimeHours: 0 }
    );

    return totals;
  },

  /**
   * Get time entries summary for reporting
   */
  async getTimeEntriesSummary(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("time_entries_with_staff")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    // Group by staff
    const summary = data.reduce((acc: any, entry) => {
      if (!acc[entry.staff_id]) {
        acc[entry.staff_id] = {
          staff_name: entry.staff_name,
          employee_id: entry.employee_id,
          total_hours: 0,
          overtime_hours: 0,
          days_worked: 0,
        };
      }

      acc[entry.staff_id].total_hours += entry.total_hours || 0;
      acc[entry.staff_id].overtime_hours += entry.overtime_hours || 0;
      acc[entry.staff_id].days_worked += 1;

      return acc;
    }, {});

    return Object.values(summary);
  },
};
