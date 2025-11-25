import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { RiCalendarLine, RiTimeLine } from "react-icons/ri";
import { ClockInFormData } from "../types";

interface ClockInFormProps {
  formData: ClockInFormData;
  onFormDataChange: (data: ClockInFormData) => void;
  staffOptions: { value: string; label: string }[];
  showValidationError?: boolean;
  duplicateEntryError?: boolean;
}

export const ClockInForm = ({
  formData,
  onFormDataChange,
  staffOptions,
  showValidationError = false,
  duplicateEntryError = false,
}: ClockInFormProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Clock In Details</h3>

      <div>
        <Select
          label="Staff Member"
          options={staffOptions}
          value={formData.staffMember}
          onChange={(e) => onFormDataChange({ ...formData, staffMember: e })}
          required
          fullWidth
        />
        {showValidationError && !formData.staffMember && (
          <div
            style={{
              color: "#d32f2f",
              fontSize: "0.813rem",
              marginTop: "0.25rem",
            }}
          >
            Please select a staff member
          </div>
        )}
        {duplicateEntryError && formData.staffMember && (
          <div
            style={{
              color: "#d32f2f",
              fontSize: "0.813rem",
              marginTop: "0.25rem",
            }}
          >
            This staff member already has a time entry for this date. Only one
            entry per day is allowed.
          </div>
        )}
      </div>

      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) =>
          onFormDataChange({ ...formData, date: e.target.value })
        }
        icon={<RiCalendarLine />}
        required
        fullWidth
        disabled
      />

      <Input
        label="Clock In Time"
        type="time"
        value={formData.clockIn}
        onChange={(e) =>
          onFormDataChange({ ...formData, clockIn: e.target.value })
        }
        icon={<RiTimeLine />}
        required
        fullWidth
        disabled
      />
    </div>
  );
};
