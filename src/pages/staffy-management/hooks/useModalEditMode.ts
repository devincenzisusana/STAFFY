import { useState, useCallback, useEffect } from "react";

/**
 * Configuration options for the modal edit mode hook
 */
interface UseModalEditModeOptions<T> {
  /** The current mode of the modal: 'create' for new entities, 'view' for existing ones */
  mode: "create" | "view";
  /** Initial data to populate the form (usually when viewing/editing existing entities) */
  initialData?: Partial<T>;
  /** Default empty form data structure */
  defaultFormData: T;
  /** Callback to handle form submission (create or update) */
  onSubmit?: (data: T) => Promise<void>;
  /** Callback to handle edit action (optional, for custom edit behavior) */
  onEdit?: () => void;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Constants for the hook
 */
const SUBMIT_GUARD_DELAY = 100; // Delay to prevent race condition when switching to edit mode

/**
 * Custom hook to manage modal edit mode state and form submission logic.
 * Handles the transition between view, edit, and create modes in a modal form.
 *
 * @template T - The type of the form data
 * @param options - Configuration options for the hook
 * @returns Object containing state and handlers for managing modal edit mode
 *
 * @example
 * ```tsx
 * const { isEditMode, formData, handleEdit, handleSubmit } = useModalEditMode({
 *   mode: 'view',
 *   initialData: staffMember,
 *   defaultFormData: emptyStaffForm,
 *   onSubmit: updateStaff,
 *   onClose: closeModal
 * });
 * ```
 */
export const useModalEditMode = <T extends Record<string, any>>({
  mode,
  initialData,
  defaultFormData,
  onSubmit,
  onEdit,
  onClose,
}: UseModalEditModeOptions<T>) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<T>({
    ...defaultFormData,
    ...initialData,
  });

  /**
   * Reset form data and edit mode when initialData changes.
   * This ensures the modal shows fresh data when reopened with a different entity.
   */
  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...initialData,
    });
    setIsEditMode(false);
    setError(null);
  }, [initialData, defaultFormData]);

  const isReadOnly = mode === "view" && !isEditMode;

  /**
   * Handles the edit button click. Switches the modal to edit mode.
   * Uses a temporary submit guard to prevent accidental form submission during state transition.
   */
  const handleEdit = useCallback(() => {
    if (mode === "view") {
      setAllowSubmit(false);
      setIsEditMode(true);
      // Re-enable submit after a short delay to prevent race condition
      setTimeout(() => setAllowSubmit(true), SUBMIT_GUARD_DELAY);
    } else if (onEdit) {
      onEdit();
    }
  }, [mode, onEdit]);

  /**
   * Handles modal close. If in edit mode, cancels editing and reverts to view mode.
   * Otherwise, closes the modal completely.
   */
  const handleClose = useCallback(() => {
    if (isEditMode && mode === "view") {
      // Cancel edit mode and reset to initial data
      setIsEditMode(false);
      if (initialData) {
        setFormData({ ...defaultFormData, ...initialData });
      }
    } else {
      onClose();
    }
  }, [isEditMode, mode, initialData, defaultFormData, onClose]);

  /**
   * Handles form submission. Validates the submission conditions and calls the onSubmit callback.
   * Closes the modal and resets state on success, keeps modal open on error.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      console.log("[useModalEditMode] handleSubmit called", {
        timestamp: new Date().toISOString(),
        mode,
        isEditMode,
        allowSubmit,
        hasOnSubmit: !!onSubmit,
      });

      // Guard clauses for invalid submission attempts
      if (!allowSubmit) {
        console.log("[useModalEditMode] Submit blocked: allowSubmit is false");
        return;
      }
      if (mode === "view" && !isEditMode) {
        console.log(
          "[useModalEditMode] Submit blocked: view mode without edit"
        );
        return;
      }
      if (!onSubmit) {
        console.log("[useModalEditMode] Submit blocked: no onSubmit handler");
        return;
      }

      console.log("[useModalEditMode] Starting submission...", {
        timestamp: new Date().toISOString(),
      });

      setIsSubmitting(true);
      setError(null);
      try {
        const submitStart = performance.now();
        await onSubmit(formData);
        const submitEnd = performance.now();
        console.log("[useModalEditMode] onSubmit completed successfully", {
          duration: `${(submitEnd - submitStart).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });
        // Reset state and close modal on successful submission
        setFormData(defaultFormData);
        setIsEditMode(false);
        setIsSubmitting(false);
        onClose();
        console.log("[useModalEditMode] Modal closed successfully");
      } catch (error) {
        console.error("[useModalEditMode] Error submitting form:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        setIsSubmitting(false);
        // Keep modal open on error to allow user to fix issues
      }
    },
    [
      mode,
      isEditMode,
      allowSubmit,
      onSubmit,
      formData,
      defaultFormData,
      onClose,
    ]
  );

  /**
   * Gets the appropriate modal title based on the current mode and edit state.
   */
  const getTitle = useCallback(
    (createTitle: string, viewTitle: string, editTitle: string) => {
      if (mode === "view") {
        return isEditMode ? editTitle : viewTitle;
      }
      return createTitle;
    },
    [mode, isEditMode]
  );

  /**
   * Gets the appropriate submit button text based on the current mode and edit state.
   */
  const getSubmitText = useCallback(
    (createText: string) => {
      if (isEditMode) {
        return "Save Changes";
      }
      return mode === "create" ? createText : "Save";
    },
    [isEditMode, mode]
  );

  return {
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
  };
};
