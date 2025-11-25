import { useQuery, useQueryClient } from "@tanstack/react-query";
import { absenceService } from "@/services/absence/absenceService";
import { AbsenceRecord } from "../components/AbsenceTable";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { queryConfig, createQueryKey } from "@/utils/queryConfig";

/**
 * Hook to manage absence data loading and transformation using React Query
 */
export const useAbsenceData = () => {
  const queryClient = useQueryClient();
  const queryKey = createQueryKey("absenceRequests");

  const { data: absenceData = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await absenceService.fetchAllAbsenceRequests();
      const absenceRequests: AbsenceRecord[] = data.map((request: any) => {
        // Calculate days between start and end date
        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

        return {
          id: request.id,
          staffId: request.staff_id,
          staffName: request.staff
            ? `${request.staff.staff_personal_data?.first_name || ""} ${
                request.staff.staff_personal_data?.last_name || ""
              }`.trim()
            : "Unknown",
          requestType: request.request_type,
          startDate: request.start_date,
          endDate: request.end_date,
          days,
          notes: request.notes || "",
          status: request.status,
          createdAt: request.created_at,
        };
      });
      return absenceRequests;
    },
    ...queryConfig.frequent, // 1min staleTime - absences change periodically
  });

  // Subscribe to real-time changes for absence_requests table
  useRealtimeSubscription({
    table: "absence_requests",
    queryKey,
    event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
  });

  const loadAbsenceRequests = async () => {
    await queryClient.invalidateQueries({ queryKey });
  };

  return {
    absenceData,
    isLoading: false, // Never show loading for smooth UX
    loadAbsenceRequests,
    setAbsenceData: () => {}, // Not needed with React Query
  };
};
