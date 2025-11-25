import { staffService } from "@/services/staff/staffService";
import { StaffFormData } from "../modals/AddStaffModal";
import { StaffMember } from "../components/StaffTable";

/**
 * Handle staff member submission (create or update)
 */
export const handleStaffSubmit = async (
  data: StaffFormData,
  staffId?: string
) => {
  if (staffId) {
    await staffService.updateStaffMember(staffId, data);
  } else {
    await staffService.createStaffMember(data);
  }
};

/**
 * Handle staff member deletion
 */
export const handleStaffDelete = async (staff: StaffMember) => {
  await staffService.deleteStaffMember(staff.id);
};

/**
 * Handle staff status change
 */
export const handleStaffStatusChange = async (
  staffId: string,
  newStatus: string,
  staffData: StaffMember[],
  onSuccess: () => Promise<void>
) => {
  try {
    await staffService.updateStaffStatus(staffId, newStatus);
    await onSuccess();
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};
