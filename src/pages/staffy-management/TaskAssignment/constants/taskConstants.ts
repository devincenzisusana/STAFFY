import { MultiSelectOption } from "@/components/common/Select";

export const TASK_CATEGORY_OPTIONS: MultiSelectOption[] = [
  { value: "bar-service", label: "Bar Service" },
  { value: "cleaning", label: "Cleaning" },
  { value: "security", label: "Security" },
  { value: "entertainment", label: "Entertainment" },
  { value: "management", label: "Management" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

export const TASK_PRIORITY_OPTIONS: MultiSelectOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const TASK_STATUS_OPTIONS: MultiSelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
