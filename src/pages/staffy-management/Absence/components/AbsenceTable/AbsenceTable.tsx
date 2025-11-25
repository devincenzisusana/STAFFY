import { Table, SortConfig } from "@/components/common/Table";
import {
  AbsenceRecord,
  createAbsenceTableColumns,
} from "./absenceTableColumns";

interface AbsenceTableProps {
  data: AbsenceRecord[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  onRowClick?: (row: AbsenceRecord) => void;
  onStatusChange?: (absenceId: string, newStatus: string) => void;
}

export const AbsenceTable = ({
  data,
  sortConfig,
  onSort,
  onRowClick,
  onStatusChange,
}: AbsenceTableProps) => {
  const columns = createAbsenceTableColumns(onStatusChange);

  return (
    <Table
      columns={columns}
      data={data}
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onRowClick}
      emptyMessage="No absence requests found."
    />
  );
};
