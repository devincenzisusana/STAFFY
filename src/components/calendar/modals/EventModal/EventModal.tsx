import { FormModal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Input";
import { useModalEditMode } from "@/pages/staffy-management/hooks";
import { RiCalendarLine, RiFileTextLine, RiText } from "react-icons/ri";
import "./EventModal.css";

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  isPublic: boolean;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: Partial<EventFormData>;
  mode?: "create" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
}

const defaultFormData: EventFormData = {
  title: "",
  description: "",
  date: "",
  isPublic: false,
};

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  onEdit,
  onDelete,
}: EventModalProps) => {
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
  } = useModalEditMode<EventFormData>({
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
      title={getTitle("Add Event", "Event Details", "Edit Event")}
      submitText={getSubmitText("Add Event")}
      loading={isSubmitting}
      mode={mode}
      isEditMode={isEditMode}
      onEdit={mode === "view" ? handleEdit : undefined}
      onDelete={onDelete}
      error={error}
    >
      <div className="event-form">
        <div className="form-section">
          <h3 className="section-title">Event Details</h3>
          <Input
            label="Title"
            id="event-title"
            type="text"
            placeholder="Enter event title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            disabled={isReadOnly}
            icon={<RiText />}
            required
            fullWidth
          />

          <Input
            label="Date"
            id="event-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled={isReadOnly}
            icon={<RiCalendarLine />}
            required
            fullWidth
          />

          <Textarea
            label="Description"
            id="event-description"
            placeholder="Enter event description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isReadOnly}
            style={{ minHeight: "120px", verticalAlign: "top" }}
            fullWidth
          />

          <div className="visibility-toggle">
            <span className="toggle-label">
              {formData.isPublic ? "Public Event" : "Private Event"}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                disabled={isReadOnly}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </FormModal>
  );
};
