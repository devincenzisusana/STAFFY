import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import { Column, SortConfig } from "../../Table";
import "./TableHeader.css";

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
}

export function TableHeader<T>({
  columns,
  sortConfig,
  onSort,
}: TableHeaderProps<T>) {
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            style={{ width: column.width }}
            className={`
              ${column.align ? `align-${column.align}` : ""}
              ${column.sortable ? "sortable" : ""}
            `.trim()}
            onClick={() => handleSort(column.key, column.sortable)}
          >
            <div className="th-content">
              <span>{column.label}</span>
              {column.sortable && (
                <div className="sort-icons">
                  <RiArrowUpSLine
                    className={`sort-icon ${
                      sortConfig?.key === column.key &&
                      sortConfig.direction === "asc"
                        ? "active"
                        : ""
                    }`}
                  />
                  <RiArrowDownSLine
                    className={`sort-icon ${
                      sortConfig?.key === column.key &&
                      sortConfig.direction === "desc"
                        ? "active"
                        : ""
                    }`}
                  />
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
