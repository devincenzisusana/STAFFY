/**
 * Format PostgreSQL interval to HH:MM display format
 * @param interval - PostgreSQL interval string (e.g., "08:30:00")
 * @returns Formatted time string (e.g., "08:30")
 *
 * @example
 * ```tsx
 * const breakTime = formatInterval("01:30:00"); // "01:30"
 * ```
 */
export const formatInterval = (interval: string): string => {
  const match = interval.match(/(\d+):(\d+):(\d+)/);
  if (match) {
    return `${match[1].padStart(2, "0")}:${match[2].padStart(2, "0")}`;
  }
  return "00:00";
};

/**
 * Convert HH:MM to PostgreSQL interval format
 * @param time - Time string in HH:MM format
 * @returns PostgreSQL interval string (HH:MM:SS)
 *
 * @example
 * ```tsx
 * const interval = toInterval("01:30"); // "01:30:00"
 * ```
 */
export const toInterval = (time: string): string => {
  if (!time) return "00:00:00";
  return `${time}:00`;
};

/**
 * Convert time string to seconds
 * @param time - Time string in HH:MM format
 * @returns Total seconds
 */
export const timeToSeconds = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};

/**
 * Convert seconds to HH:MM format
 * @param seconds - Total seconds
 * @returns Time string in HH:MM format
 */
export const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
