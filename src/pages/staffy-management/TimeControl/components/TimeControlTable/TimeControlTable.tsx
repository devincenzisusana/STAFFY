import { Table, SortConfig } from "@/components/common/Table";
import { TimeEntry } from "./types";
import { createTimeControlTableColumns } from "./timeControlTableColumns";

interface TimeControlTableProps {
  data: TimeEntry[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  onRowClick?: (row: TimeEntry) => void;
}

export const TimeControlTable = ({
  data,
  sortConfig,
  onSort,
  onRowClick,
}: TimeControlTableProps) => {
  const columns = createTimeControlTableColumns();

  return (
    <Table
      columns={columns}
      data={data}
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onRowClick}
      emptyMessage="No time entries found."
    />
  );
};
