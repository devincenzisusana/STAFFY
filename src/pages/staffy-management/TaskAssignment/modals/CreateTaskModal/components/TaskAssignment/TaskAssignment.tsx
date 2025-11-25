import { Select } from "@/components/common/Select";

interface TaskAssignmentProps {
  assignedTo: string;
  onAssignedToChange: (value: string) => void;
  isReadOnly?: boolean;
  staffOptions: Array<{ value: string; label: string }>;
}

export const TaskAssignment = ({
  assignedTo,
  onAssignedToChange,
  isReadOnly = false,
  staffOptions,
}: TaskAssignmentProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Assignment</h3>
      <Select
        label="Assign To"
        options={[
          { value: "", label: "Select staff member (optional)" },
          ...staffOptions,
        ]}
        value={assignedTo}
        onChange={onAssignedToChange}
        disabled={isReadOnly}
        placeholder="Select staff member (optional)"
        fullWidth
      />
    </div>
  );
};
