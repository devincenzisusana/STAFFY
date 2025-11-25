import { useState, useMemo } from "react";
import { SortConfig } from "../Table";

export function useTableSort<T extends Record<string, any>>(
  data: T[],
  initialSort?: SortConfig
) {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(
    initialSort
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Compare numbers and dates
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((currentSort) => {
      // If clicking the same column, toggle direction
      if (currentSort?.key === key) {
        return {
          key,
          direction: currentSort.direction === "asc" ? "desc" : "asc",
        };
      }
      // If clicking a new column, default to ascending
      return { key, direction: "asc" };
    });
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
