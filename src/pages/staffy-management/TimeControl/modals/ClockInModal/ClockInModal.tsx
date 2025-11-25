import { useState, useEffect } from "react";
import { FormModal } from "@/components/common/Modal";
import { ClockInForm } from "./components";
import { ClockInFormData } from "./types";
import { getCurrentDateTime } from "./utils";

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClockInFormData) => Promise<void>;
  staffOptions: Array<{ value: string; label: string }>;
}

const defaultFormData: ClockInFormData = {
  staffMember: "",
  date: "",
  clockIn: "",
};

export const ClockInModal = ({
  isOpen,
  onClose,
  onSubmit,
  staffOptions,
}: ClockInModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClockInFormData>(defaultFormData);
  const [showValidationError, setShowValidationError] = useState(false);
  const [duplicateEntryError, setDuplicateEntryError] = useState(false);

  // Initialize with current date and time when modal opens
  useEffect(() => {
    if (isOpen) {
      const { date, time } = getCurrentDateTime();
      setFormData({
        staffMember: "",
        date: date,
        clockIn: time,
      });
      setShowValidationError(false);
      setDuplicateEntryError(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate staff member is selected
    if (!formData.staffMember) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    setDuplicateEntryError(false);

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(defaultFormData);
      setIsSubmitting(false);
      onClose();
    } catch (error: any) {
      console.error("Error clocking in:", error);
      // Check if it's a duplicate entry error
      if (
        error.message?.includes("already has a time entry") ||
        error.message?.includes("duplicate key")
      ) {
        setDuplicateEntryError(true);
      }
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setShowValidationError(false);
    setDuplicateEntryError(false);
    onClose();
  };

  const handleFormDataChange = (data: ClockInFormData) => {
    setFormData(data);
    // Clear validation error when user selects a staff member
    if (data.staffMember && showValidationError) {
      setShowValidationError(false);
    }
    // Clear duplicate entry error when staff member changes
    if (data.staffMember !== formData.staffMember && duplicateEntryError) {
      setDuplicateEntryError(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Clock In"
      submitText="Clock In"
      loading={isSubmitting}
      mode="create"
    >
      <div className="clock-in-modal">
        <ClockInForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          staffOptions={staffOptions}
          showValidationError={showValidationError}
          duplicateEntryError={duplicateEntryError}
        />
      </div>
    </FormModal>
  );
};
