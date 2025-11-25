import { Input } from "@/components/common/Input";
import { RiCalendarLine } from "react-icons/ri";
import { getTodayString } from "@/components/calendar/utils";

interface ScheduleDatesProps {
  startDate: string;
  finishDate: string;
  onStartDateChange: (value: string) => void;
  onFinishDateChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const ScheduleDates = ({
  startDate,
  finishDate,
  onStartDateChange,
  onFinishDateChange,
  isReadOnly = false,
}: ScheduleDatesProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Schedule Dates</h3>
      <div className="form-row">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          min={getTodayString()}
          icon={<RiCalendarLine />}
          disabled={isReadOnly}
          required
          fullWidth
        />
        <Input
          label="Finish Date"
          type="date"
          value={finishDate}
          onChange={(e) => onFinishDateChange(e.target.value)}
          min={startDate || getTodayString()}
          icon={<RiCalendarLine />}
          disabled={isReadOnly}
          required
          fullWidth
        />
      </div>
    </div>
  );
};
