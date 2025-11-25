import { useState, useMemo } from "react";

export interface FilterConfig<T> {
  searchFields?: (keyof T)[];
  filterFields?: {
    field: keyof T;
    values: string[];
  }[];
}

export interface UseEntityFiltersReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Record<string, string[]>;
  setFilter: (key: string, values: string[]) => void;
  filteredData: T[];
}

export function useEntityFilters<T>(
  data: T[],
  config: FilterConfig<T>
): UseEntityFiltersReturn<T> {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const setFilter = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (config.searchFields && searchQuery) {
        const matchesSearch = config.searchFields.some((field) => {
          const value = item[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });
        if (!matchesSearch) return false;
      }

      // Field filters
      if (config.filterFields) {
        for (const filterConfig of config.filterFields) {
          const filterValues = filters[filterConfig.field as string];
          if (filterValues && filterValues.length > 0) {
            const itemValue = item[filterConfig.field];
            if (!filterValues.includes(itemValue as string)) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, filters, config]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    filteredData,
  };
}
