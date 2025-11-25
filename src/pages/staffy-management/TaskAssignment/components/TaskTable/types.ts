import { SortConfig } from "@/components/common/Table";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  assignedTo?: string;
  assignedToName?: string;
  status: string;
  dueDate: string;
  dueTime?: string;
  createdAt?: string;
}

export interface TaskTableProps {
  data: Task[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  onRowClick?: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onPriorityChange?: (taskId: string, newPriority: string) => void;
}
