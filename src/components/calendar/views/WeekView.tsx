import { Schedule } from "../hooks/useScheduleData";
import { ScheduleItem } from "../components/ScheduleItem";
import { isToday, getWeekDays } from "@/utils/dateUtils";
import { getSchedulesForDate, splitSchedules } from "../utils/scheduleUtils";
import "./WeekView.css";

interface WeekViewProps {
  currentDate: Date;
  onDayClick?: (date: Date) => void;
  onScheduleClick?: (schedule: Schedule) => void;
  onMoreClick?: (schedules: Schedule[]) => void;
  schedules?: Schedule[];
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const WeekView = ({
  currentDate,
  onDayClick,
  onScheduleClick,
  onMoreClick,
  schedules = [],
}: WeekViewProps) => {
  const handleDayClick = (date: Date, e: React.MouseEvent) => {
    // Only trigger day click if we didn't click on a schedule item
    if ((e.target as HTMLElement).closest(".schedule-item")) {
      return;
    }

    if (onDayClick) {
      onDayClick(date);
    }
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

  const weekDays = getWeekDays(currentDate);

  return (
    <div className="week-view">
      <div className="week-view-header">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`week-day-header ${isToday(day) ? "today" : ""}`}
          >
            <div className="day-name">{DAYS_OF_WEEK[day.getDay()]}</div>
            <div className="day-date">{day.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="week-view-grid">
        {weekDays.map((day, index) => {
          const daySchedules = getSchedulesForDate(day, schedules);
          const { visible, remainingCount } = splitSchedules(daySchedules, 3);

          return (
            <div
              key={index}
              className={`week-day-column ${
                isToday(day) ? "today" : ""
              } clickable`}
              onClick={(e) => handleDayClick(day, e)}
            >
              {remainingCount > 0 && (
                <div
                  className="more-indicator-week"
                  onClick={(e) => handleMoreClick(daySchedules, e)}
                >
                  +{remainingCount}
                </div>
              )}
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
                    variant="default"
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
