import { Input } from "@/components/common/Input";

interface EmergencyContactProps {
  emergencyContactName: string;
  emergencyContactNumber: string;
  onEmergencyContactNameChange: (value: string) => void;
  onEmergencyContactNumberChange: (value: string) => void;
  disabled?: boolean;
}

export const EmergencyContact = ({
  emergencyContactName,
  emergencyContactNumber,
  onEmergencyContactNameChange,
  onEmergencyContactNumberChange,
  disabled = false,
}: EmergencyContactProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Emergency Contact</h3>
      <div className="form-row">
        <Input
          label="Emergency Contact Name"
          type="text"
          placeholder="Enter emergency contact name"
          value={emergencyContactName}
          onChange={(e) => onEmergencyContactNameChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Emergency Contact Number"
          type="tel"
          placeholder="Enter emergency contact number"
          value={emergencyContactNumber}
          onChange={(e) => onEmergencyContactNumberChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
    </div>
  );
};
