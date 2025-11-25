import { Input } from "@/components/common/Input";
import { RiCalendarLine, RiTimeLine } from "react-icons/ri";

interface TaskScheduleProps {
  dueDate: string;
  dueTime: string;
  onDueDateChange: (value: string) => void;
  onDueTimeChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const TaskSchedule = ({
  dueDate,
  dueTime,
  onDueDateChange,
  onDueTimeChange,
  isReadOnly = false,
}: TaskScheduleProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Schedule</h3>
      <div className="form-row">
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          icon={<RiCalendarLine />}
          disabled={isReadOnly}
          required
          fullWidth
        />
        <Input
          label="Due Time"
          type="time"
          value={dueTime}
          onChange={(e) => onDueTimeChange(e.target.value)}
          icon={<RiTimeLine />}
          disabled={isReadOnly}
          fullWidth
        />
      </div>
    </div>
  );
};
