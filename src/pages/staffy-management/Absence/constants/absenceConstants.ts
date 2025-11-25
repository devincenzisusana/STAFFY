import { MultiSelectOption } from "@/components/common/Select";

export const ABSENCE_REQUEST_TYPE_OPTIONS: MultiSelectOption[] = [
  { value: "vacation", label: "Vacation" },
  { value: "sick-leave", label: "Sick Leave" },
  { value: "personal", label: "Personal" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

export const ABSENCE_STATUS_OPTIONS: MultiSelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
