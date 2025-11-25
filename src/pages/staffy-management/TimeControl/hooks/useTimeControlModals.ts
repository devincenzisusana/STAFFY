import { useState } from "react";
import { TimeEntry } from "../components/TimeControlTable";

/**
 * Hook to manage time control modals state
 */
export const useTimeControlModals = () => {
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  const openClockInModal = () => setIsClockInModalOpen(true);
  const closeClockInModal = () => setIsClockInModalOpen(false);

  const openClockOutModal = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setIsClockOutModalOpen(true);
  };

  const closeClockOutModal = () => {
    setIsClockOutModalOpen(false);
    setSelectedEntry(null);
  };

  const handleRowClick = (entry: TimeEntry) => {
    // Only allow clock out for active entries (no clock out time yet)
    if (entry.status === "active" && !entry.clockOut) {
      openClockOutModal(entry);
    }
    // TODO: Open modal to view completed time entry details
  };

  return {
    isClockInModalOpen,
    isClockOutModalOpen,
    selectedEntry,
    openClockInModal,
    closeClockInModal,
    openClockOutModal,
    closeClockOutModal,
    handleRowClick,
  };
};
