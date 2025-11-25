/**
 * Status color mappings for different entities
 */

export type ScheduleStatus =
  | "scheduled"
  | "confirmed"
  | "cancelled"
  | "completed";
export type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled";
export type AbsenceStatus = "pending" | "approved" | "rejected";
export type StaffStatus = "active" | "inactive" | "on-leave";

export const scheduleStatusColors: Record<ScheduleStatus, string> = {
  scheduled: "#2196f3",
  confirmed: "#4caf50",
  cancelled: "#f44336",
  completed: "#9c27b0",
};

export const taskStatusColors: Record<TaskStatus, string> = {
  pending: "#ff9800",
  "in-progress": "#2196f3",
  completed: "#4caf50",
  cancelled: "#f44336",
};

export const absenceStatusColors: Record<AbsenceStatus, string> = {
  pending: "#ff9800",
  approved: "#4caf50",
  rejected: "#f44336",
};

export const staffStatusColors: Record<StaffStatus, string> = {
  active: "#4caf50",
  inactive: "#9e9e9e",
  "on-leave": "#ff9800",
};

/**
 * Get status color by type and status value
 */
export const getStatusColor = (
  type: "schedule" | "task" | "absence" | "staff",
  status: string
): string => {
  switch (type) {
    case "schedule":
      return scheduleStatusColors[status as ScheduleStatus] || "#9e9e9e";
    case "task":
      return taskStatusColors[status as TaskStatus] || "#9e9e9e";
    case "absence":
      return absenceStatusColors[status as AbsenceStatus] || "#9e9e9e";
    case "staff":
      return staffStatusColors[status as StaffStatus] || "#9e9e9e";
    default:
      return "#9e9e9e";
  }
};
