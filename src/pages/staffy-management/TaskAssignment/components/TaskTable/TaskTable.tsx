import { Table } from "@/components/common/Table";
import { TaskTableProps } from "./types";
import { createTaskTableColumns } from "./taskTableColumns";

export const TaskTable = ({
  data,
  sortConfig,
  onSort,
  onRowClick,
  onStatusChange,
  onPriorityChange,
}: TaskTableProps) => {
  const columns = createTaskTableColumns(onStatusChange, onPriorityChange);

  return (
    <Table
      columns={columns}
      data={data}
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onRowClick}
      emptyMessage="No tasks found."
    />
  );
};
