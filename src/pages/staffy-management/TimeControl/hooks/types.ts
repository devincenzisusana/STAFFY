import { TimeEntry } from "../components/TimeControlTable";

/**
 * Hook to manage time entries data fetching and state
 */
export interface UseTimeEntriesReturn {
  timeEntries: TimeEntry[];
  isLoading: boolean;
  loadTimeEntries: () => void;
}
