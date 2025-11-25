import { Select, SelectOption } from "@/components/common/Select";

interface ScheduleStatusProps {
  scheduleStatus: string;
  onScheduleStatusChange: (value: string) => void;
  isReadOnly?: boolean;
}

const statusOptions: SelectOption[] = [
  { value: "", label: "Select status" },
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export const ScheduleStatus = ({
  scheduleStatus,
  onScheduleStatusChange,
  isReadOnly = false,
}: ScheduleStatusProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Status</h3>
      <Select
        label="Schedule Status"
        options={statusOptions}
        value={scheduleStatus}
        onChange={onScheduleStatusChange}
        placeholder="Select status"
        disabled={isReadOnly}
        required
        fullWidth
      />
    </div>
  );
};
