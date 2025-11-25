import { useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule/scheduleService";

export interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  finishDate: string;
  shiftStart: string;
  shiftEnd: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

/**
 * Hook to manage schedule data loading and transformation using React Query
 */
export const useScheduleData = () => {
  const queryClient = useQueryClient();

  const { data: scheduleData = [] } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const data = await scheduleService.fetchAllSchedules();
      const schedules: Schedule[] = data.map((schedule: any) => ({
        id: schedule.id,
        staffId: schedule.staff_id,
        staffName: schedule.staff
          ? `${schedule.staff.staff_personal_data?.first_name || ""} ${
              schedule.staff.staff_personal_data?.last_name || ""
            }`.trim()
          : "Unknown",
        startDate: schedule.start_date,
        finishDate: schedule.finish_date,
        shiftStart: schedule.shift_start?.substring(0, 5) || "", // Remove seconds
        shiftEnd: schedule.shift_end?.substring(0, 5) || "", // Remove seconds
        status: schedule.status,
        notes: schedule.notes || "",
        createdAt: schedule.created_at,
      }));
      return schedules;
    },
  });

  const loadSchedules = async () => {
    await queryClient.invalidateQueries({ queryKey: ["schedules"] });
  };

  return {
    scheduleData,
    isLoading: false, // Never show loading for smooth UX
    loadSchedules,
  };
};
