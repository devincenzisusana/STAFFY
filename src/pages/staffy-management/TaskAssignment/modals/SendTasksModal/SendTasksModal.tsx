import { useState, useMemo } from "react";
import { FormModal } from "@/components/common/Modal";
import { Textarea } from "@/components/common/Input";
import { MultiSelect, MultiSelectOption } from "@/components/common/Select";
import { useStaffOptions } from "@/pages/staffy-management/hooks";
import "./SendTasksModal.css";

const priorityOptions: MultiSelectOption[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const statusOptions: MultiSelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export interface SendTasksFormData {
  staffMembers: string[];
  priorities: string[];
  statuses: string[];
  message: string;
}

interface SendTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SendTasksFormData) => Promise<void>;
}

export const SendTasksModal = ({
  isOpen,
  onClose,
  onSubmit,
}: SendTasksModalProps) => {
  const { staffOptions } = useStaffOptions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SendTasksFormData>({
    staffMembers: [],
    priorities: [],
    statuses: [],
    message: "",
  });

  // Add "All Members" option at the beginning
  const staffOptionsWithAll = useMemo(
    () => [{ value: "__ALL__", label: "All Members" }, ...staffOptions],
    [staffOptions]
  );

  const handleStaffChange = (value: string[]) => {
    // If "All Members" is selected, select all individual staff members
    if (value.includes("__ALL__")) {
      const allStaffIds = staffOptions.map((opt) => opt.value);
      setFormData({ ...formData, staffMembers: allStaffIds });
    } else {
      setFormData({ ...formData, staffMembers: value });
    }
  };

  // Check if all staff members are selected
  const allSelected =
    staffOptions.length > 0 &&
    formData.staffMembers.length === staffOptions.length;

  // Display value: show "__ALL__" if all are selected, otherwise show actual selection
  const displayValue = allSelected
    ? ["__ALL__", ...formData.staffMembers]
    : formData.staffMembers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        staffMembers: [],
        priorities: [],
        statuses: [],
        message: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Send Tasks"
      mode="create"
      submitText="Send"
      loading={isSubmitting}
    >
      <div className="form-section">
        <MultiSelect
          label="Staff Members"
          options={staffOptionsWithAll}
          value={displayValue}
          onChange={handleStaffChange}
          placeholder="Select staff members"
          required
          fullWidth
        />
      </div>

      <div className="form-section">
        <MultiSelect
          label="Task Priority"
          options={priorityOptions}
          value={formData.priorities}
          onChange={(value) => setFormData({ ...formData, priorities: value })}
          placeholder="Select priorities to include"
          required
          fullWidth
        />
      </div>

      <div className="form-section">
        <MultiSelect
          label="Task Status"
          options={statusOptions}
          value={formData.statuses}
          onChange={(value) => setFormData({ ...formData, statuses: value })}
          placeholder="Select statuses to include"
          required
          fullWidth
        />
      </div>

      <div className="form-section">
        <Textarea
          label="Message"
          placeholder="Add a message to include with the tasks..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={4}
          fullWidth
        />
      </div>
    </FormModal>
  );
};
