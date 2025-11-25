import { TimeEntry } from "../components/TimeControlTable";

/**
 * Filter time entries by date range
 */
export const filterByDateRange = (
  entries: TimeEntry[],
  startDate: string,
  endDate: string
): TimeEntry[] => {
  if (!startDate && !endDate) return entries;

  return entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return entryDate >= start && entryDate <= end;
    } else if (start) {
      return entryDate >= start;
    } else if (end) {
      return entryDate <= end;
    }
    return true;
  });
};

/**
 * Calculate total hours from time entries
 */
export const calculateTotalHours = (entries: TimeEntry[]): number => {
  return entries.reduce((sum, entry) => {
    const hours = parseFloat(entry.totalHours || "0");
    return sum + hours;
  }, 0);
};
