import {
  Select,
  SelectOption,
  MultiSelect,
  MultiSelectOption,
} from "@/components/common/Select";

interface StaffInformationProps {
  staffMember: string | string[];
  onStaffMemberChange: (value: string | string[]) => void;
  staffOptions: Array<{ value: string; label: string }>;
  isReadOnly?: boolean;
  allowMultiple?: boolean;
}

export const StaffInformation = ({
  staffMember,
  onStaffMemberChange,
  staffOptions,
  isReadOnly = false,
  allowMultiple = false,
}: StaffInformationProps) => {
  if (allowMultiple) {
    const multiOptions: MultiSelectOption[] = staffOptions.map((option) => ({
      value: option.value,
      label: option.label,
    }));

    return (
      <div className="form-section">
        <h3 className="section-title">Staff Information</h3>
        <MultiSelect
          label="Staff Members"
          options={multiOptions}
          value={Array.isArray(staffMember) ? staffMember : []}
          onChange={(value) => onStaffMemberChange(value)}
          placeholder="Select staff members"
          disabled={isReadOnly}
          required
          fullWidth
        />
      </div>
    );
  }

  const options: SelectOption[] = [
    { value: "", label: "Select staff member" },
    ...staffOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  return (
    <div className="form-section">
      <h3 className="section-title">Staff Information</h3>
      <Select
        label="Staff Member"
        options={options}
        value={typeof staffMember === "string" ? staffMember : ""}
        onChange={(value) => onStaffMemberChange(value)}
        placeholder="Select staff member"
        disabled={isReadOnly}
        required
        fullWidth
      />
    </div>
  );
};
