import { ReactNode } from "react";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import "./Table.css";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => ReactNode;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  sortConfig,
  onSort,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
}: TableProps<T>) {
  const tableClasses = [
    "table",
    striped && "table-striped",
    hoverable && "table-hoverable",
    bordered && "table-bordered",
    compact && "table-compact",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className={tableClasses}>
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          <TableBody
            columns={columns}
            data={data}
            loading={loading}
            emptyMessage={emptyMessage}
            onRowClick={onRowClick}
          />
        </table>
      </div>
    </div>
  );
}
