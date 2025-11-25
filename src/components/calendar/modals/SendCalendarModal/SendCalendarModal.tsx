import { useState, useMemo } from "react";
import { FormModal } from "../../../common/Modal";
import { Textarea } from "../../../common/Input";
import { MultiSelect, MultiSelectOption } from "../../../common/Select";
import { useStaffOptions } from "@/pages/staffy-management/hooks";
import "./SendCalendarModal.css";

const statusOptions: MultiSelectOption[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export interface SendCalendarFormData {
  staffMembers: string[];
  statuses: string[];
  message: string;
}

interface SendCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SendCalendarFormData) => Promise<void>;
}

export const SendCalendarModal = ({
  isOpen,
  onClose,
  onSubmit,
}: SendCalendarModalProps) => {
  const { staffOptions } = useStaffOptions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SendCalendarFormData>({
    staffMembers: [],
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
      title="Send Calendar"
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
          label="Schedule Status"
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
          placeholder="Add a message to include with the calendar..."
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
