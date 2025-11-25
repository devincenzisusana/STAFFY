import { Input } from "@/components/common/Input";
import { RiCalendarLine } from "react-icons/ri";

interface EmploymentInformationProps {
  position: string;
  department: string;
  hireDate: string;
  onPositionChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onHireDateChange: (value: string) => void;
  disabled?: boolean;
}

export const EmploymentInformation = ({
  position,
  department,
  hireDate,
  onPositionChange,
  onDepartmentChange,
  onHireDateChange,
  disabled = false,
}: EmploymentInformationProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Employment Information</h3>
      <div className="form-row">
        <Input
          label="Position"
          type="text"
          placeholder="Enter position"
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Department"
          type="text"
          placeholder="Enter department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
      <div className="form-row">
        <Input
          label="Hire Date"
          type="date"
          placeholder="Select hire date"
          value={hireDate}
          onChange={(e) => onHireDateChange(e.target.value)}
          icon={<RiCalendarLine />}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
    </div>
  );
};
