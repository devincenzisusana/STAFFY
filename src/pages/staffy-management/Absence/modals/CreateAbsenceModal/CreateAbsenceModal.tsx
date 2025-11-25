import { FormModal } from "@/components/common/Modal";
import { Input, Textarea } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import { useModalEditMode, useStaffOptions } from "../../../hooks";
import "./CreateAbsenceModal.css";

const requestTypeOptions: SelectOption[] = [
  { value: "", label: "Select request type" },
  { value: "vacation", label: "Vacation" },
  { value: "sick-leave", label: "Sick Leave" },
  { value: "personal", label: "Personal" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

export interface AbsenceFormData {
  staffMember: string;
  requestType: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface CreateAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AbsenceFormData) => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
  initialData?: Partial<AbsenceFormData>;
  mode?: "create" | "view";
}

const defaultFormData: AbsenceFormData = {
  staffMember: "",
  requestType: "",
  startDate: "",
  endDate: "",
  notes: "",
};

export const CreateAbsenceModal = ({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
  initialData,
  mode = "create",
}: CreateAbsenceModalProps) => {
  // Load staff options
  const { staffOptions: staffData } = useStaffOptions();

  const {
    isEditMode,
    isSubmitting,
    isReadOnly,
    formData,
    setFormData,
    handleEdit,
    handleClose,
    handleSubmit,
    getTitle,
    getSubmitText,
  } = useModalEditMode<AbsenceFormData>({
    mode,
    initialData,
    defaultFormData,
    onSubmit,
    onEdit,
    onClose,
  });

  // Format staff options for select component
  const staffOptions: SelectOption[] = [
    { value: "", label: "Select staff member" },
    ...staffData.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onEdit={mode === "view" ? handleEdit : undefined}
      onDelete={onDelete}
      title={getTitle(
        "Create Absence Request",
        "Absence Request Details",
        "Edit Absence Request"
      )}
      submitText={getSubmitText("Create Request")}
      mode={mode}
      isEditMode={isEditMode}
      loading={isSubmitting}
      size="lg"
    >
      <div className="absence-form">
        {/* Staff Member Section */}
        <div className="form-section">
          <h3 className="form-section-title">Staff Member</h3>
          <Select
            label="Staff Member"
            options={staffOptions}
            value={formData.staffMember}
            onChange={(value) =>
              setFormData({ ...formData, staffMember: value })
            }
            placeholder="Select staff member"
            required
            fullWidth
            disabled={isReadOnly}
          />
        </div>

        {/* Request Type Section */}
        <div className="form-section">
          <h3 className="form-section-title">Request Type</h3>
          <Select
            label="Request Type"
            options={requestTypeOptions}
            value={formData.requestType}
            onChange={(value) =>
              setFormData({ ...formData, requestType: value })
            }
            placeholder="Select request type"
            required
            fullWidth
            disabled={isReadOnly}
          />
        </div>

        {/* Dates Section */}
        <div className="form-section">
          <h3 className="form-section-title">Dates</h3>
          <div className="form-row">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              min={getTodayString()}
              required
              fullWidth
              disabled={isReadOnly}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              min={formData.startDate || getTodayString()}
              required
              fullWidth
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Additional Information</h3>
          <Textarea
            label="Notes"
            placeholder="Add any additional notes or details (optional)"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={4}
            fullWidth
            disabled={isReadOnly}
          />
        </div>
      </div>
    </FormModal>
  );
};
