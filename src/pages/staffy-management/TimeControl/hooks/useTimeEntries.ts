import { useQuery, useQueryClient } from "@tanstack/react-query";
import { timeControlService } from "@/services/timeControl";
import { TimeEntry } from "../components/TimeControlTable";
import { UseTimeEntriesReturn } from "./types";
import { formatInterval } from "../../utils";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { queryConfig, createQueryKey } from "@/utils/queryConfig";

/**
 * Hook to manage time entries data using React Query
 */
export const useTimeEntries = (): UseTimeEntriesReturn => {
  const queryClient = useQueryClient();
  const queryKey = createQueryKey("timeEntries");

  const { data: timeEntries = [] } = useQuery<TimeEntry[]>({
    queryKey,
    queryFn: async () => {
      const data = await timeControlService.fetchAllTimeEntries();

      // Transform database data to match TimeEntry interface
      const transformedData: TimeEntry[] = data.map((entry) => ({
        id: entry.id,
        staffMember: entry.staff_name,
        date: entry.date,
        clockIn: entry.clock_in?.substring(0, 5) || "",
        clockOut: entry.clock_out?.substring(0, 5) || "",
        breakDuration: entry.break_duration
          ? formatInterval(entry.break_duration)
          : "",
        overtime: entry.overtime_hours?.toFixed(2) || "0.00",
        totalHours: entry.total_hours?.toFixed(2) || "0.00",
        status: entry.clock_out ? "approved" : "active",
      }));

      return transformedData;
    },
    ...queryConfig.frequent, // 1min staleTime - time entries change frequently
  });

  // Subscribe to real-time changes for time_entries table
  useRealtimeSubscription({
    table: "time_entries",
    queryKey,
    event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
  });

  const loadTimeEntries = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    timeEntries,
    isLoading: false, // Never show loading for smooth UX
    loadTimeEntries,
  };
};
