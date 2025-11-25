import { Column } from "@/components/common/Table";
import {
  StatusBadge,
  StatusBadgeSelect,
  StatusOption,
} from "@/components/shared/StatusBadge";
import { Task } from "./types";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../../constants/taskConstants";

const getPriorityVariant = (
  priority: string
): "error" | "warning" | "success" | "neutral" => {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "error";
    case "high":
      return "warning";
    case "low":
      return "success";
    case "medium":
    default:
      return "neutral";
  }
};

const getStatusVariant = (
  status: string
): "error" | "warning" | "success" | "neutral" => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "error";
    case "in-progress":
    default:
      return "neutral";
  }
};

// Convert options to StatusOption format
const priorityStatusOptions: StatusOption[] = TASK_PRIORITY_OPTIONS.map(
  (opt) => ({
    value: opt.value,
    label: opt.label,
    variant: getPriorityVariant(opt.value),
  })
);

const statusOptions: StatusOption[] = TASK_STATUS_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
  variant: getStatusVariant(opt.value),
}));

export const createTaskTableColumns = (
  onStatusChange?: (taskId: string, newStatus: string) => void,
  onPriorityChange?: (taskId: string, newPriority: string) => void
): Column<Task>[] => [
  {
    key: "status",
    label: "STATUS",
    sortable: true,
    width: "16.66%",
    render: (_, task) =>
      onStatusChange ? (
        <StatusBadgeSelect
          value={task.status}
          options={statusOptions}
          onChange={(newStatus) => onStatusChange(task.id, newStatus)}
        />
      ) : (
        <StatusBadge
          status={task.status}
          variant={getStatusVariant(task.status)}
        />
      ),
  },
  {
    key: "assignedTo",
    label: "STAFF MEMBER",
    sortable: true,
    width: "16.66%",
    render: (_, task) => task.assignedToName || "Unassigned",
  },
  {
    key: "title",
    label: "TASK TITLE",
    sortable: true,
    width: "16.66%",
  },
  {
    key: "category",
    label: "CATEGORY",
    sortable: true,
    width: "16.66%",
  },
  {
    key: "priority",
    label: "PRIORITY",
    sortable: true,
    width: "16.66%",
    render: (_, task) =>
      onPriorityChange ? (
        <StatusBadgeSelect
          value={task.priority}
          options={priorityStatusOptions}
          onChange={(newPriority) => onPriorityChange(task.id, newPriority)}
        />
      ) : (
        <StatusBadge
          status={task.priority}
          variant={getPriorityVariant(task.priority)}
        />
      ),
  },
  {
    key: "dueDate",
    label: "DUE DATE",
    sortable: true,
    width: "16.66%",
  },
];
