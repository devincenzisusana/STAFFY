import { useState, useEffect } from "react";
import { FormModal } from "@/components/common/Modal";
import { ClockOutForm } from "./components";
import { ClockOutFormData } from "./types";
import { getCurrentTime, calculateTotalHours } from "./utils";
import { TimeEntry } from "../../components/TimeControlTable";

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClockOutFormData) => Promise<void>;
  entry: TimeEntry | null;
}

const defaultFormData: ClockOutFormData = {
  clockOut: "",
  breakDuration: "00:00",
};

export const ClockOutModal = ({
  isOpen,
  onClose,
  onSubmit,
  entry,
}: ClockOutModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClockOutFormData>(defaultFormData);

  // Initialize with current time when modal opens
  useEffect(() => {
    if (isOpen && entry) {
      setFormData({
        clockOut: getCurrentTime(),
        breakDuration: entry.breakDuration || "00:00",
      });
    }
  }, [isOpen, entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(defaultFormData);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error clocking out:", error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  if (!entry) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Clock Out"
      submitText="Clock Out"
      loading={isSubmitting}
      mode="create"
    >
      <div className="clock-out-modal">
        <ClockOutForm
          formData={formData}
          onFormDataChange={setFormData}
          staffMember={entry.staffMember}
          date={entry.date}
          clockIn={entry.clockIn}
        />
      </div>
    </FormModal>
  );
};
