import { Table, SortConfig } from "@/components/common/Table";
import { StaffMember, createStaffTableColumns } from "./staffTableColumns";

interface StaffTableProps {
  data: StaffMember[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  onRowClick?: (row: StaffMember) => void;
  onStatusChange?: (staffId: string, newStatus: string) => void;
}

export const StaffTable = ({
  data,
  sortConfig,
  onSort,
  onRowClick,
  onStatusChange,
}: StaffTableProps) => {
  const columns = createStaffTableColumns(onStatusChange);

  return (
    <Table
      columns={columns}
      data={data}
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onRowClick}
      emptyMessage="No staff members found."
    />
  );
};
