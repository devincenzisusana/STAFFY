import { Schedule } from "../hooks/useScheduleData";
import { ScheduleItem } from "../components/ScheduleItem";
import { isToday } from "@/utils/dateUtils";
import { getSchedulesForDate, splitSchedules } from "../utils/scheduleUtils";
import "./MonthView.css";

interface MonthViewProps {
  currentDate: Date;
  onDayClick?: (date: Date) => void;
  onScheduleClick?: (schedule: Schedule) => void;
  onMoreClick?: (schedules: Schedule[]) => void;
  schedules?: Schedule[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MonthView = ({
  currentDate,
  onDayClick,
  onScheduleClick,
  onMoreClick,
  schedules = [],
}: MonthViewProps) => {
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1);
      days.push(prevMonthDay.getDate());
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push(i);
    }

    return days;
  };

  const isTodayCell = (day: number, index: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    if (
      index < firstDayOfWeek ||
      index >= firstDayOfWeek + new Date(year, month + 1, 0).getDate()
    ) {
      return false;
    }

    const cellDate = new Date(year, month, day);
    return isToday(cellDate);
  };

  const isCurrentMonth = (index: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return index >= firstDayOfWeek && index < firstDayOfWeek + daysInMonth;
  };

  const getSchedulesForDay = (day: number, index: number): Schedule[] => {
    if (!isCurrentMonth(index)) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);

    return getSchedulesForDate(date, schedules);
  };

  const handleDayClick = (day: number, index: number, e: React.MouseEvent) => {
    // Only trigger day click if we didn't click on a schedule item
    if ((e.target as HTMLElement).closest(".schedule-item")) {
      return;
    }

    if (!onDayClick || !isCurrentMonth(index)) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const clickedDate = new Date(year, month, day);

    onDayClick(clickedDate);
  };

  const handleScheduleClick = (schedule: Schedule, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent day click
    if (onScheduleClick) {
      onScheduleClick(schedule);
    }
  };

  const handleMoreClick = (allSchedules: Schedule[], e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent day click
    if (onMoreClick) {
      onMoreClick(allSchedules);
    }
  };

  const days = getMonthDays(currentDate);

  return (
    <div className="month-view">
      <div className="month-view-header">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      <div className="month-view-grid">
        {days.map((day, index) => {
          const daySchedules = getSchedulesForDay(day as number, index);
          const { visible, remainingCount } = splitSchedules(daySchedules, 2);

          return (
            <div
              key={index}
              className={`day-cell ${
                !isCurrentMonth(index) ? "other-month" : ""
              } ${isTodayCell(day as number, index) ? "today" : ""} ${
                isCurrentMonth(index) ? "clickable" : ""
              }`}
              onClick={(e) => handleDayClick(day as number, index, e)}
            >
              <div className="day-number">
                {day}
                {remainingCount > 0 && (
                  <span
                    className="more-indicator"
                    onClick={(e) => handleMoreClick(daySchedules, e)}
                  >
                    +{remainingCount}
                  </span>
                )}
              </div>
              <div className="day-content">
                {visible.map((schedule) => (
                  <ScheduleItem
                    key={schedule.id}
                    staffName={schedule.staffName}
                    shiftStart={schedule.shiftStart}
                    shiftEnd={schedule.shiftEnd}
                    status={
                      schedule.status as
                        | "scheduled"
                        | "confirmed"
                        | "cancelled"
                        | "completed"
                    }
                    variant="compact"
                    onClick={(e) => handleScheduleClick(schedule, e)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
