import { ReactNode, FormEvent } from "react";
import { Modal } from "../Modal";
import { Button } from "../../Button";
import "./FormModal.css";

/**
 * Props for the FormModal component
 */
interface FormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Callback when the form is submitted */
  onSubmit?: (e: FormEvent) => void;
  /** Callback when the edit button is clicked (view mode only) */
  onEdit?: () => void;
  /** Callback when the delete button is clicked (view mode only) */
  onDelete?: () => void;
  /** Modal title */
  title: string;
  /** Form content */
  children: ReactNode;
  /** Modal size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Custom submit button text */
  submitText?: string;
  /** Custom cancel button text */
  cancelText?: string;
  /** Whether the form is submitting */
  loading?: boolean;
  /** Current mode of the modal */
  mode: "create" | "edit" | "view";
  /** Whether the modal is in edit mode (only relevant when mode is 'view') */
  isEditMode?: boolean;
  /** Error message to display */
  error?: string | null;
}

/**
 * A modal component designed for form interactions with support for create, view, and edit modes.
 * Automatically handles the transition between view and edit states, and renders appropriate
 * action buttons based on the current mode.
 *
 * @example
 * ```tsx
 * <FormModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 *   title="Edit Staff Member"
 *   mode="view"
 *   isEditMode={isEditMode}
 *   onEdit={handleEdit}
 * >
 *   <FormFields />
 * </FormModal>
 * ```
 */
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
  title,
  children,
  size = "md",
  submitText,
  cancelText = "Cancel",
  loading = false,
  mode,
  isEditMode = false,
  error,
}: FormModalProps) => {
  const defaultSubmitText = mode === "create" ? "Create" : "Save Changes";
  const isReadOnly = mode === "view" && !isEditMode;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("[FormModal] handleSubmit called", {
      timestamp: new Date().toISOString(),
      mode,
      isEditMode,
      isReadOnly,
      hasOnSubmit: !!onSubmit,
    });
    if (onSubmit && !isReadOnly) {
      console.log("[FormModal] Calling onSubmit...");
      onSubmit(e);
    } else {
      console.log("[FormModal] Submit blocked", {
        hasOnSubmit: !!onSubmit,
        isReadOnly,
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
  };

  const renderViewModeFooter = () => (
    <>
      {onDelete && (
        <Button variant="danger" onClick={onDelete} type="button">
          Delete
        </Button>
      )}
      <div>
        <Button variant="outline" onClick={onClose} type="button">
          Close
        </Button>
        {onEdit && !isEditMode && (
          <Button variant="primary" onClick={handleEditClick} type="button">
            Edit
          </Button>
        )}
      </div>
    </>
  );

  const renderEditModeFooter = () => (
    <>
      <div />
      <div>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          type="button"
        >
          {cancelText}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          form="form-modal"
        >
          {submitText || defaultSubmitText}
        </Button>
      </div>
    </>
  );

  const footer = isReadOnly ? renderViewModeFooter() : renderEditModeFooter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={footer}
      closeOnOverlayClick={!loading}
    >
      <form id="form-modal" className="form-modal" onSubmit={handleSubmit}>
        {children}
        {error && (
          <div className="form-error" role="alert">
            <span className="form-error-icon">⚠</span>
            <span className="form-error-message">{error}</span>
          </div>
        )}
      </form>
    </Modal>
  );
};
