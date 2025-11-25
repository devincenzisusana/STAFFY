import { Input } from "@/components/common/Input";
import { RiUserLine, RiMailLine, RiIdCardLine } from "react-icons/ri";

interface BasicInformationProps {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  idNumber: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onEmployeeIdChange: (value: string) => void;
  onIdNumberChange: (value: string) => void;
  disabled?: boolean;
}

export const BasicInformation = ({
  firstName,
  lastName,
  email,
  employeeId,
  idNumber,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onEmployeeIdChange,
  onIdNumberChange,
  disabled = false,
}: BasicInformationProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Basic Information</h3>
      <div className="form-row">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          icon={<RiUserLine />}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          icon={<RiUserLine />}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
      <div className="form-row">
        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          icon={<RiMailLine />}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Employee ID"
          type="text"
          placeholder="Enter employee ID"
          value={employeeId}
          onChange={(e) => onEmployeeIdChange(e.target.value)}
          icon={<RiIdCardLine />}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
      <div className="form-row">
        <Input
          label="ID Number"
          type="text"
          placeholder="Enter ID number"
          value={idNumber}
          onChange={(e) => onIdNumberChange(e.target.value)}
          icon={<RiIdCardLine />}
          helperText="Government ID number or national identification number"
          required
          fullWidth
          disabled={disabled}
        />
      </div>
    </div>
  );
};
