import { Input } from "@/components/common/Input";
import { RiSearchLine, RiCalendarLine } from "react-icons/ri";
import { FilterBar } from "@/components/shared/FilterBar";

interface TimeControlFiltersProps {
  startDate: string;
  endDate: string;
  searchQuery: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSearchChange: (query: string) => void;
}

/**
 * Filter controls for time control page
 */
export const TimeControlFilters = ({
  startDate,
  endDate,
  searchQuery,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
}: TimeControlFiltersProps) => {
  return (
    <FilterBar>
      <div style={{ minWidth: "180px" }}>
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          icon={<RiCalendarLine />}
        />
      </div>
      <div style={{ minWidth: "180px" }}>
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          icon={<RiCalendarLine />}
        />
      </div>
      <div style={{ minWidth: "250px" }}>
        <Input
          label="Search"
          type="text"
          placeholder="Search by staff member..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<RiSearchLine />}
        />
      </div>
    </FilterBar>
  );
};
