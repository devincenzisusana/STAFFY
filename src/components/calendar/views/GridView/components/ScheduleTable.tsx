import { Table, SortConfig } from "@/components/common/Table";
import { Schedule } from "../../../hooks";
import { createScheduleTableColumns } from "../scheduleTableColumns";
import { scheduleService } from "@/services/schedule/scheduleService";

interface ScheduleTableProps {
  schedules: Schedule[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  onScheduleClick: (schedule: Schedule) => void;
  onScheduleUpdate?: () => void;
}

export const ScheduleTable = ({
  schedules,
  sortConfig,
  onSort,
  onScheduleClick,
  onScheduleUpdate,
}: ScheduleTableProps) => {
  const handleStatusChange = async (scheduleId: string, newStatus: string) => {
    await scheduleService.updateScheduleStatus(scheduleId, newStatus);
    onScheduleUpdate?.();
  };

  // Sort data
  const sortedSchedules = [...schedules].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof Schedule];
    const bValue = b[sortConfig.key as keyof Schedule];

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const columns = createScheduleTableColumns(handleStatusChange);

  return (
    <Table
      columns={columns}
      data={sortedSchedules}
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onScheduleClick}
      emptyMessage="No schedules found."
    />
  );
};
