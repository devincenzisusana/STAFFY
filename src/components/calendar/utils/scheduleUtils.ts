import { Schedule } from "../hooks/useScheduleData";
import { formatDateToString, isDateInRange } from "@/utils/dateUtils";

/**
 * Filter schedules that overlap with a specific date
 */
export const getSchedulesForDate = (
  date: Date,
  schedules: Schedule[]
): Schedule[] => {
  const dateStr = formatDateToString(date);
  const currentDate = new Date(dateStr);

  return schedules.filter((schedule) => {
    const startDate = new Date(schedule.startDate);
    const finishDate = new Date(schedule.finishDate);
    return isDateInRange(currentDate, startDate, finishDate);
  });
};

/**
 * Split schedules into visible and overflow
 */
export const splitSchedules = (
  schedules: Schedule[],
  visibleCount: number
): { visible: Schedule[]; remainingCount: number } => {
  const visible = schedules.slice(0, visibleCount);
  const remainingCount = Math.max(0, schedules.length - visibleCount);

  return { visible, remainingCount };
};
