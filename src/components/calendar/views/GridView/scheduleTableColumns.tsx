import { Column } from "@/components/common/Table";
import {
  StatusBadge,
  StatusBadgeSelect,
  StatusOption,
} from "@/components/shared/StatusBadge";
import { Schedule } from "../../hooks";

const getStatusVariant = (
  status: string
): "error" | "warning" | "success" | "neutral" => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success";
    case "scheduled":
      return "neutral";
    case "cancelled":
      return "error";
    case "completed":
      return "success";
    default:
      return "neutral";
  }
};

const statusOptions: StatusOption[] = [
  { value: "scheduled", label: "Scheduled", variant: "neutral" },
  { value: "confirmed", label: "Confirmed", variant: "success" },
  { value: "cancelled", label: "Cancelled", variant: "error" },
  { value: "completed", label: "Completed", variant: "success" },
];

export const createScheduleTableColumns = (
  onStatusChange?: (scheduleId: string, newStatus: string) => void
): Column<Schedule>[] => [
  {
    key: "status",
    label: "STATUS",
    sortable: true,
    width: "14.28%",
    render: (_, schedule) =>
      onStatusChange ? (
        <StatusBadgeSelect
          value={schedule.status}
          options={statusOptions}
          onChange={(newStatus) => onStatusChange(schedule.id, newStatus)}
        />
      ) : (
        <StatusBadge
          status={
            schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)
          }
          variant={getStatusVariant(schedule.status)}
        />
      ),
  },
  {
    key: "staffMember",
    label: "STAFF MEMBER",
    sortable: true,
    width: "14.28%",
    render: (_, schedule) => schedule.staffName,
  },
  {
    key: "startDate",
    label: "START DATE",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "finishDate",
    label: "END DATE",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "shiftStart",
    label: "SHIFT START",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "shiftEnd",
    label: "SHIFT END",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "notes",
    label: "NOTES",
    sortable: false,
    width: "14.28%",
    render: (_, schedule) => schedule.notes || "-",
  },
];
