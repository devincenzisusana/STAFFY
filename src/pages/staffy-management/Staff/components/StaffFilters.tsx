import { Input } from "@/components/common/Input";
import { MultiSelect } from "@/components/common/Select";
import { FilterBar } from "@/components/shared/FilterBar";
import { STAFF_STATUS_OPTIONS } from "../constants/staffConstants";
import { RiSearchLine } from "react-icons/ri";

interface StaffFiltersProps {
  filters: Record<string, any>;
  searchQuery: string;
  onFilterChange: (field: string, value: any) => void;
  onSearchChange: (query: string) => void;
}

export const StaffFilters = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: StaffFiltersProps) => {
  return (
    <FilterBar>
      <div style={{ minWidth: "180px" }}>
        <MultiSelect
          options={STAFF_STATUS_OPTIONS}
          value={filters.status || []}
          onChange={(values) => onFilterChange("status", values)}
          placeholder="Filter by status"
        />
      </div>
      <div style={{ minWidth: "250px" }}>
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<RiSearchLine />}
        />
      </div>
    </FilterBar>
  );
};
