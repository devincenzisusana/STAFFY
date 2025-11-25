import { FormModal } from "@/components/common/Modal";
import { StaffInformation } from "./components/StaffInformation";
import { ScheduleDates } from "./components/ScheduleDates";
import { ShiftTimes } from "./components/ShiftTimes";
import { ScheduleStatus } from "./components/ScheduleStatus";
import { ScheduleNotes } from "./components/ScheduleNotes";
import {
  useModalEditMode,
  useStaffOptions,
} from "@/pages/staffy-management/hooks";
import "./ScheduleModal.css";

export interface ScheduleFormData {
  staffMember: string | string[];
  startDate: string;
  finishDate: string;
  shiftStart: string;
  shiftEnd: string;
  scheduleStatus: string;
  notes: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  initialData?: Partial<ScheduleFormData>;
  mode?: "create" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
}

const defaultFormData: ScheduleFormData = {
  staffMember: [],
  startDate: "",
  finishDate: "",
  shiftStart: "",
  shiftEnd: "",
  scheduleStatus: "",
  notes: "",
};

export const ScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  onEdit,
  onDelete,
}: ScheduleModalProps) => {
  // Load staff options
  const { staffOptions } = useStaffOptions();

  const {
    isEditMode,
    isSubmitting,
    isReadOnly,
    error,
    formData,
    setFormData,
    handleEdit,
    handleClose,
    handleSubmit,
    getTitle,
    getSubmitText,
  } = useModalEditMode<ScheduleFormData>({
    mode,
    initialData,
    defaultFormData,
    onSubmit,
    onEdit,
    onClose,
  });

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={getTitle("Create Schedule", "Schedule Details", "Edit Schedule")}
      submitText={getSubmitText("Create Schedule")}
      loading={isSubmitting}
      mode={mode}
      isEditMode={isEditMode}
      onEdit={mode === "view" ? handleEdit : undefined}
      onDelete={onDelete}
      error={error}
    >
      <div className="schedule-form">
        <StaffInformation
          staffMember={formData.staffMember}
          onStaffMemberChange={(value: string | string[]) =>
            setFormData({ ...formData, staffMember: value })
          }
          staffOptions={staffOptions}
          isReadOnly={isReadOnly}
          allowMultiple={mode === "create"}
        />

        <ScheduleDates
          startDate={formData.startDate}
          finishDate={formData.finishDate}
          onStartDateChange={(value: string) =>
            setFormData({ ...formData, startDate: value })
          }
          onFinishDateChange={(value: string) =>
            setFormData({ ...formData, finishDate: value })
          }
          isReadOnly={isReadOnly}
        />

        <ShiftTimes
          shiftStart={formData.shiftStart}
          shiftEnd={formData.shiftEnd}
          onShiftStartChange={(value: string) =>
            setFormData({ ...formData, shiftStart: value })
          }
          onShiftEndChange={(value: string) =>
            setFormData({ ...formData, shiftEnd: value })
          }
          isReadOnly={isReadOnly}
        />

        <ScheduleStatus
          scheduleStatus={formData.scheduleStatus}
          onScheduleStatusChange={(value: string) =>
            setFormData({ ...formData, scheduleStatus: value })
          }
          isReadOnly={isReadOnly}
        />

        <ScheduleNotes
          notes={formData.notes}
          onNotesChange={(value: string) =>
            setFormData({ ...formData, notes: value })
          }
          isReadOnly={isReadOnly}
        />
      </div>
    </FormModal>
  );
};
