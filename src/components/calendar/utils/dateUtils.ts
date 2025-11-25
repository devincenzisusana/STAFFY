/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Navigate to previous period based on view type
 */
export const navigatePrevious = (
  currentDate: Date,
  view: "month" | "week"
): Date => {
  const newDate = new Date(currentDate);
  if (view === "month") {
    newDate.setMonth(currentDate.getMonth() - 1);
  } else {
    newDate.setDate(currentDate.getDate() - 7);
  }
  return newDate;
};

/**
 * Navigate to next period based on view type
 */
export const navigateNext = (
  currentDate: Date,
  view: "month" | "week"
): Date => {
  const newDate = new Date(currentDate);
  if (view === "month") {
    newDate.setMonth(currentDate.getMonth() + 1);
  } else {
    newDate.setDate(currentDate.getDate() + 7);
  }
  return newDate;
};

/**
 * Get current date
 */
export const getToday = (): Date => {
  return new Date();
};
