import { timeControlService } from "@/services/timeControl";
import { ClockInFormData } from "../modals/ClockInModal";
import { ClockOutFormData } from "../modals/ClockOutModal";
import { toInterval } from "../../utils";

/**
 * Handle clock in submission
 */
export const handleClockIn = async (
  formData: ClockInFormData,
  onSuccess: () => void
) => {
  try {
    await timeControlService.clockIn({
      staff_id: formData.staffMember,
      date: formData.date,
      clock_in: formData.clockIn + ":00",
    });
    await onSuccess();
  } catch (error: any) {
    console.error("Error clocking in:", error);
    // Re-throw error to be handled by modal
    throw error;
  }
};

/**
 * Handle clock out submission
 */
export const handleClockOut = async (
  entryId: string,
  formData: ClockOutFormData,
  onSuccess: () => void
) => {
  try {
    // Convert break duration HH:MM to PostgreSQL interval format
    const breakInterval = toInterval(formData.breakDuration);

    await timeControlService.clockOut(entryId, {
      clock_out: formData.clockOut + ":00",
      break_duration: breakInterval,
    });

    await onSuccess();
  } catch (error) {
    console.error("Error clocking out:", error);
    throw error;
  }
};
