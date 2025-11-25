import { Column } from "@/components/common/Table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  StatusBadgeSelect,
  StatusOption,
} from "@/components/shared/StatusBadge/StatusBadgeSelect";

export interface AbsenceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffMember?: string; // For backwards compatibility
  requestType: string;
  type?: string; // For backwards compatibility
  startDate: string;
  endDate: string;
  days?: number;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt?: string;
}

const statusVariantMap: Record<string, "success" | "warning" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const statusOptions: StatusOption[] = [
  { value: "pending", label: "Pending", variant: "warning" },
  { value: "approved", label: "Approved", variant: "success" },
  { value: "rejected", label: "Rejected", variant: "error" },
  { value: "cancelled", label: "Cancelled", variant: "error" },
];

export const createAbsenceTableColumns = (
  onStatusChange?: (absenceId: string, newStatus: string) => void
): Column<AbsenceRecord>[] => [
  {
    key: "status",
    label: "STATUS",
    sortable: true,
    width: "16.66%",
    render: (_, absence) =>
      onStatusChange ? (
        <StatusBadgeSelect
          value={absence.status}
          options={statusOptions}
          onChange={(newStatus) => onStatusChange(absence.id, newStatus)}
        />
      ) : (
        <StatusBadge
          status={
            absence.status.charAt(0).toUpperCase() + absence.status.slice(1)
          }
          variant={statusVariantMap[absence.status]}
        />
      ),
  },
  {
    key: "staffMember",
    label: "STAFF MEMBER",
    sortable: true,
    width: "16.66%",
    render: (_, absence) => absence.staffName,
  },
  {
    key: "type",
    label: "TYPE",
    sortable: true,
    width: "16.66%",
    render: (_, absence) => absence.requestType,
  },
  {
    key: "startDate",
    label: "START DATE",
    sortable: true,
    width: "16.66%",
  },
  {
    key: "endDate",
    label: "END DATE",
    sortable: true,
    width: "16.66%",
  },
  {
    key: "days",
    label: "DAYS",
    sortable: true,
    width: "16.66%",
  },
];
