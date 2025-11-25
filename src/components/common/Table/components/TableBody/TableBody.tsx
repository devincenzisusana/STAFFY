import { Column } from "../../Table";
import "./TableBody.css";

interface TableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function TableBody<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
}: TableBodyProps<T>) {
  if (loading) {
    return (
      <tbody>
        {[...Array(5)].map((_, rowIndex) => (
          <tr key={rowIndex} className="table-skeleton-row">
            {columns.map((column) => (
              <td key={column.key}>
                <div className="table-skeleton-cell">
                  <div className="skeleton-shimmer" />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="table-empty">
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          onClick={() => onRowClick?.(row)}
          className={onRowClick ? "table-row-clickable" : ""}
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className={column.align ? `align-${column.align}` : ""}
            >
              {column.render
                ? column.render(row[column.key], row)
                : row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
