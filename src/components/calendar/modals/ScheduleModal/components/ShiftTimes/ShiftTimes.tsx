import { Input } from "@/components/common/Input";
import { RiTimeLine } from "react-icons/ri";

interface ShiftTimesProps {
  shiftStart: string;
  shiftEnd: string;
  onShiftStartChange: (value: string) => void;
  onShiftEndChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const ShiftTimes = ({
  shiftStart,
  shiftEnd,
  onShiftStartChange,
  onShiftEndChange,
  isReadOnly = false,
}: ShiftTimesProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Shift Times</h3>
      <div className="form-row">
        <Input
          label="Shift Start"
          type="time"
          value={shiftStart}
          onChange={(e) => onShiftStartChange(e.target.value)}
          icon={<RiTimeLine />}
          disabled={isReadOnly}
          required
          fullWidth
        />
        <Input
          label="Shift End"
          type="time"
          value={shiftEnd}
          onChange={(e) => onShiftEndChange(e.target.value)}
          icon={<RiTimeLine />}
          disabled={isReadOnly}
          required
          fullWidth
        />
      </div>
    </div>
  );
};
