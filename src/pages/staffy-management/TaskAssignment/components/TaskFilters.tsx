import { Input } from "@/components/common/Input";
import { MultiSelect } from "@/components/common/Select";
import { FilterBar } from "@/components/shared/FilterBar";
import {
  TASK_CATEGORY_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../constants/taskConstants";
import { RiSearchLine } from "react-icons/ri";

interface TaskFiltersProps {
  filters: Record<string, any>;
  searchQuery: string;
  onFilterChange: (field: string, value: any) => void;
  onSearchChange: (query: string) => void;
}

export const TaskFilters = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: TaskFiltersProps) => {
  return (
    <FilterBar>
      <div style={{ minWidth: "180px" }}>
        <MultiSelect
          options={TASK_CATEGORY_OPTIONS}
          value={filters.category || []}
          onChange={(values) => onFilterChange("category", values)}
          placeholder="Filter by category"
        />
      </div>
      <div style={{ minWidth: "180px" }}>
        <MultiSelect
          options={TASK_PRIORITY_OPTIONS}
          value={filters.priority || []}
          onChange={(values) => onFilterChange("priority", values)}
          placeholder="Filter by priority"
        />
      </div>
      <div style={{ minWidth: "180px" }}>
        <MultiSelect
          options={TASK_STATUS_OPTIONS}
          value={filters.status || []}
          onChange={(values) => onFilterChange("status", values)}
          placeholder="Filter by status"
        />
      </div>
      <div style={{ minWidth: "250px" }}>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<RiSearchLine />}
        />
      </div>
    </FilterBar>
  );
};
