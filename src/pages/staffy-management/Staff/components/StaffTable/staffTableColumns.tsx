import { Column } from "@/components/common/Table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  StatusBadgeSelect,
  StatusOption,
} from "@/components/shared/StatusBadge/StatusBadgeSelect";

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: "active" | "inactive" | "on-leave";
  // Personal data fields
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  gdprConsentGiven: boolean;
}

const statusVariantMap: Record<
  string,
  "success" | "warning" | "error" | "neutral"
> = {
  active: "success",
  inactive: "neutral",
  "on-leave": "warning",
};

const statusLabelMap: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
};

const statusOptions: StatusOption[] = [
  { value: "active", label: "Active", variant: "success" },
  { value: "on-leave", label: "On Leave", variant: "warning" },
  { value: "inactive", label: "Inactive", variant: "neutral" },
];

export const createStaffTableColumns = (
  onStatusChange?: (staffId: string, newStatus: string) => void
): Column<StaffMember>[] => [
  {
    key: "status",
    label: "STATUS",
    sortable: true,
    width: "12.5%",
    render: (_, staff) =>
      onStatusChange ? (
        <StatusBadgeSelect
          value={staff.status}
          options={statusOptions}
          onChange={(newStatus) => onStatusChange(staff.id, newStatus)}
        />
      ) : (
        <StatusBadge
          status={statusLabelMap[staff.status]}
          variant={statusVariantMap[staff.status]}
        />
      ),
  },
  {
    key: "name",
    label: "STAFF MEMBER",
    sortable: true,
    width: "12.5%",
  },
  {
    key: "employeeId",
    label: "EMPLOYEE ID",
    sortable: true,
    width: "12.5%",
  },
  {
    key: "position",
    label: "POSITION",
    sortable: true,
    width: "12.5%",
  },
  {
    key: "department",
    label: "DEPARTMENT",
    sortable: true,
    width: "12.5%",
  },
  {
    key: "email",
    label: "EMAIL",
    sortable: false,
    width: "12.5%",
  },
  {
    key: "phone",
    label: "PHONE",
    sortable: false,
    width: "12.5%",
  },
  {
    key: "hireDate",
    label: "HIRE DATE",
    sortable: true,
    width: "12.5%",
  },
];
