import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "../menu";
import { Button } from "@/components/common/Button";
import { useTableSort } from "@/components/common/Table";
import { PageContent } from "@/components/shared/PageContent";
import { useEntityFilters, useStaffOptions } from "../hooks";
import { RiTimeLine, RiLoginBoxLine } from "react-icons/ri";
import { TimeControlTable } from "./components/TimeControlTable";
import { ClockInModal } from "./modals/ClockInModal";
import { ClockOutModal } from "./modals/ClockOutModal";
import { SummaryBox } from "@/components/shared/SummaryBox";
import { TimeControlFilters } from "./components/TimeControlFilters";
import {
  useTimeEntries,
  useTimeControlModals,
  useDateRangeFilter,
} from "./hooks";
import { filterByDateRange, calculateTotalHours } from "./utils";
import { handleClockIn, handleClockOut } from "./handlers";
import { useAuth } from "@/context/AuthContext";

export const TimeControl = () => {
  const { userRole } = useAuth();

  // Data hooks
  const { timeEntries, isLoading, loadTimeEntries } = useTimeEntries();
  const { staffOptions } = useStaffOptions();

  // Filter hooks
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeFilter();
  const { searchQuery, setSearchQuery, filteredData } = useEntityFilters(
    timeEntries,
    {
      searchFields: ["staffMember"],
    }
  );

  // Modal hooks
  const {
    isClockInModalOpen,
    isClockOutModalOpen,
    selectedEntry,
    openClockInModal,
    closeClockInModal,
    closeClockOutModal,
    handleRowClick,
  } = useTimeControlModals();

  // Apply date range filter
  const dateFilteredData = filterByDateRange(filteredData, startDate, endDate);

  // Apply sorting
  const { sortedData, sortConfig, handleSort } = useTableSort(dateFilteredData);

  // Calculate total hours for filtered staff member
  const totalWorkedHours = searchQuery.trim()
    ? calculateTotalHours(sortedData).toFixed(2)
    : null;

  // Handlers
  const handleClockInSubmit = async (data: any) => {
    await handleClockIn(data, loadTimeEntries);
  };

  const handleClockOutSubmit = async (data: any) => {
    if (!selectedEntry) return;
    await handleClockOut(selectedEntry.id, data, loadTimeEntries);
  };

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Time Control"
      pageIcon={RiTimeLine}
      pageDescription="Track and manage staff working hours"
      headerActions={
        <Button
          variant="primary"
          icon={<RiLoginBoxLine />}
          onClick={openClockInModal}
        >
          Clock In
        </Button>
      }
    >
      <PageContent description="Monitor clock-in/clock-out times and manage staff attendance records.">
        <TimeControlFilters
          startDate={startDate}
          endDate={endDate}
          searchQuery={searchQuery}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearchChange={setSearchQuery}
        />

        {totalWorkedHours !== null && (
          <SummaryBox
            label="Total Hours Worked:"
            value={`${totalWorkedHours} hours`}
            variant="primary"
            icon={<RiTimeLine />}
          />
        )}

        {isLoading ? (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#757575" }}
          >
            Loading time entries...
          </div>
        ) : (
          <TimeControlTable
            data={sortedData}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />
        )}
      </PageContent>

      <ClockInModal
        isOpen={isClockInModalOpen}
        onClose={closeClockInModal}
        onSubmit={handleClockInSubmit}
        staffOptions={staffOptions}
      />

      <ClockOutModal
        isOpen={isClockOutModalOpen}
        onClose={closeClockOutModal}
        onSubmit={handleClockOutSubmit}
        entry={selectedEntry}
      />
    </DashboardLayout>
  );
};
