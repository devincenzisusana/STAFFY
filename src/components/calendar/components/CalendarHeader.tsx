import { Button } from "../../common/Button";
import { MultiSelect, MultiSelectOption } from "../../common/Select";
import { Input } from "../../common/Input";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine,
  RiSendPlaneLine,
  RiSearchLine,
  RiCalendarEventLine,
} from "react-icons/ri";
import "./CalendarHeader.css";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "month" | "week" | "grid";
  viewMode: "calendar" | "events";
  onViewModeChange: (mode: "calendar" | "events") => void;
  onViewChange: (view: "month" | "week" | "grid") => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateSchedule: () => void;
  onSendCalendar: () => void;
  onCreateEvent: () => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string[]) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  userRole?: string | null;
}

const statusOptions: MultiSelectOption[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export const CalendarHeader = ({
  currentDate,
  view,
  viewMode,
  onViewModeChange,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onCreateSchedule,
  onSendCalendar,
  onCreateEvent,
  statusFilter,
  onStatusFilterChange,
  searchQuery = "",
  onSearchChange,
  userRole,
}: CalendarHeaderProps) => {
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <h2 className="calendar-title">{monthYear}</h2>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>

        <div className="view-mode-toggle">
          <label className="view-mode-switch">
            <input
              type="checkbox"
              checked={viewMode === "events"}
              onChange={(e) =>
                onViewModeChange(e.target.checked ? "events" : "calendar")
              }
            />
            <span className="view-mode-slider"></span>
          </label>
          <span className="view-mode-label">
            {viewMode === "calendar" ? "Calendar" : "Events"}
          </span>
        </div>

        <div className="calendar-filters">
          <div className="status-filter">
            <MultiSelect
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filter by status"
            />
          </div>
          {onSearchChange && userRole !== "staff-operator" && (
            <div className="staff-search">
              <Input
                type="text"
                placeholder="Search staff member..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                icon={<RiSearchLine />}
              />
            </div>
          )}
        </div>
      </div>

      <div className="calendar-header-right">
        <div className="view-toggle">
          <Button
            variant={view === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "grid" ? "primary" : "outline"}
            size="sm"
            onClick={() => onViewChange("grid")}
          >
            Grid
          </Button>
        </div>

        <div className="navigation-buttons">
          <Button
            variant="outline"
            size="sm"
            icon={<RiArrowLeftSLine />}
            onClick={onPrevious}
          />
          <Button
            variant="outline"
            size="sm"
            icon={<RiArrowRightSLine />}
            onClick={onNext}
          />
        </div>

        {userRole === "admin-operator" && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<RiCalendarEventLine />}
              onClick={onCreateEvent}
            >
              Add Event
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<RiSendPlaneLine />}
              onClick={onSendCalendar}
            >
              Send Calendar
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<RiAddLine />}
              onClick={onCreateSchedule}
            >
              Create Schedule
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
