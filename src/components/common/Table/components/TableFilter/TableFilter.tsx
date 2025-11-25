import { ReactNode } from "react";
import { Input } from "../../../Input";
import { Select, SelectOption } from "../../../Select";
import { Button } from "../../../Button";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import "./TableFilter.css";

export interface FilterConfig {
  searchValue?: string;
  searchPlaceholder?: string;
  selectFilters?: {
    key: string;
    label: string;
    options: SelectOption[];
    value: string;
  }[];
  customFilters?: ReactNode;
}

interface TableFilterProps {
  config: FilterConfig;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

export const TableFilter = ({
  config,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  showClearButton = true,
}: TableFilterProps) => {
  const hasActiveFilters = () => {
    if (config.searchValue) return true;
    if (config.selectFilters?.some((f) => f.value)) return true;
    return false;
  };

  return (
    <div className="table-filter">
      <div className="table-filter-left">
        {onSearchChange && (
          <div className="table-filter-search">
            <Input
              placeholder={config.searchPlaceholder || "Search..."}
              value={config.searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<RiSearchLine />}
            />
          </div>
        )}

        {config.selectFilters?.map((filter) => (
          <div key={filter.key} className="table-filter-select">
            <Select
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={(value) => onFilterChange?.(filter.key, value)}
              placeholder={`Select ${filter.label.toLowerCase()}`}
            />
          </div>
        ))}

        {config.customFilters}
      </div>

      <div className="table-filter-right">
        {showClearButton && hasActiveFilters() && onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            icon={<RiCloseLine />}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
