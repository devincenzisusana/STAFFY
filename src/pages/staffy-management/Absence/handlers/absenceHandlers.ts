import { absenceService } from "@/services/absence/absenceService";

/**
 * Handle absence status change
 */
export const handleAbsenceStatusChange = async (
  absenceId: string,
  newStatus: string,
  loadAbsenceRequests: () => Promise<void>
) => {
  try {
    await absenceService.updateAbsenceStatus(absenceId, newStatus);
    await loadAbsenceRequests();
  } catch (error) {
    console.error("Error updating absence status:", error);
    throw error;
  }
};
