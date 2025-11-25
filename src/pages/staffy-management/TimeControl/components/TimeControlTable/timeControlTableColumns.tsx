import { Column } from "@/components/common/Table";
import { TimeEntry } from "./types";

export const createTimeControlTableColumns = (): Column<TimeEntry>[] => [
  {
    key: "date",
    label: "DATE",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "staffMember",
    label: "STAFF MEMBER",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "clockIn",
    label: "CLOCK IN",
    sortable: true,
    width: "14.28%",
  },
  {
    key: "clockOut",
    label: "CLOCK OUT",
    sortable: true,
    width: "14.28%",
    render: (value) => value || "-",
  },
  {
    key: "breakDuration",
    label: "BREAK",
    sortable: false,
    width: "14.28%",
    render: (value) => value || "-",
  },
  {
    key: "overtime",
    label: "OVERTIME",
    sortable: true,
    width: "14.28%",
    render: (value) => value || "-",
  },
  {
    key: "totalHours",
    label: "TOTAL HOURS",
    sortable: true,
    width: "14.28%",
    render: (value) => value || "-",
  },
];
