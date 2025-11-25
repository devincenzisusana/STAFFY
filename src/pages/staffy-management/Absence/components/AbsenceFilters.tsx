import { Input } from "@/components/common/Input";
import { MultiSelect } from "@/components/common/Select";
import { FilterBar } from "@/components/shared/FilterBar";
import {
  ABSENCE_REQUEST_TYPE_OPTIONS,
  ABSENCE_STATUS_OPTIONS,
} from "../constants/absenceConstants";
import { RiSearchLine } from "react-icons/ri";

interface AbsenceFiltersProps {
  filters: Record<string, any>;
  searchQuery: string;
  onFilterChange: (field: string, value: any) => void;
  onSearchChange: (query: string) => void;
}

export const AbsenceFilters = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: AbsenceFiltersProps) => {
  return (
    <FilterBar>
      <div style={{ minWidth: "180px" }}>
        <MultiSelect
          options={ABSENCE_REQUEST_TYPE_OPTIONS}
          value={filters.type || []}
          onChange={(values) => onFilterChange("type", values)}
          placeholder="Filter by type"
        />
      </div>
      <div style={{ minWidth: "180px" }}>
        <MultiSelect
          options={ABSENCE_STATUS_OPTIONS}
          value={filters.status || []}
          onChange={(values) => onFilterChange("status", values)}
          placeholder="Filter by status"
        />
      </div>
      <div style={{ minWidth: "250px" }}>
        <Input
          type="text"
          placeholder="Search staff member..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<RiSearchLine />}
        />
      </div>
    </FilterBar>
  );
};
