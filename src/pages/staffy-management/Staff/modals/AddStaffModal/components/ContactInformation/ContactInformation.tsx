import { Input } from "@/components/common/Input";
import { RiPhoneLine } from "react-icons/ri";

interface ContactInformationProps {
  phoneNumber: string;
  dateOfBirth: string;
  onPhoneNumberChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  disabled?: boolean;
}

export const ContactInformation = ({
  phoneNumber,
  dateOfBirth,
  onPhoneNumberChange,
  onDateOfBirthChange,
  disabled = false,
}: ContactInformationProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Contact Information</h3>
      <div className="form-row">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          icon={<RiPhoneLine />}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Date of Birth"
          type="date"
          placeholder="dd/mm/aaaa"
          value={dateOfBirth}
          onChange={(e) => onDateOfBirthChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
    </div>
  );
};
