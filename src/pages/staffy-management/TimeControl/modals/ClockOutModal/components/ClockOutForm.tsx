import { Input } from "@/components/common/Input";
import { RiTimeLine } from "react-icons/ri";
import { ClockOutFormData } from "../types";
import { InfoBox } from "@/components/shared/InfoBox";

interface ClockOutFormProps {
  formData: ClockOutFormData;
  onFormDataChange: (data: ClockOutFormData) => void;
  staffMember: string;
  date: string;
  clockIn: string;
}

export const ClockOutForm = ({
  formData,
  onFormDataChange,
  staffMember,
  date,
  clockIn,
}: ClockOutFormProps) => {
  const handleChange = (field: keyof ClockOutFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="form-section">
      <InfoBox
        items={[
          { label: "Staff Member", value: staffMember },
          { label: "Date", value: date },
          { label: "Clock In", value: clockIn },
        ]}
      />

      <Input
        label="Clock Out"
        type="time"
        value={formData.clockOut}
        onChange={(e) => handleChange("clockOut", e.target.value)}
        icon={<RiTimeLine />}
        required
        disabled
        fullWidth
      />

      <Input
        label="Break Duration"
        type="time"
        value={formData.breakDuration}
        onChange={(e) => handleChange("breakDuration", e.target.value)}
        icon={<RiTimeLine />}
        placeholder="00:00"
        fullWidth
      />
    </div>
  );
};
