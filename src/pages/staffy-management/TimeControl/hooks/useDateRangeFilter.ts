import { useState } from "react";

/**
 * Hook to manage date range filters
 */
export const useDateRangeFilter = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearFilters,
  };
};
