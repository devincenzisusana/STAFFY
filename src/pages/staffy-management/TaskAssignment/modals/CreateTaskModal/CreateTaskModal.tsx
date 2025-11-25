import { FormModal } from "@/components/common/Modal";
import { TaskInformation } from "./components/TaskInformation";
import { TaskCategoryPriority } from "./components/TaskCategoryPriority";
import { TaskAssignment } from "./components/TaskAssignment";
import { TaskSchedule } from "./components/TaskSchedule";
import { useModalEditMode, useStaffOptions } from "../../../hooks";
import "./CreateTaskModal.css";

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  dueTime: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Partial<TaskFormData>;
  mode?: "create" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
}

const defaultFormData: TaskFormData = {
  title: "",
  description: "",
  category: "",
  priority: "medium",
  assignedTo: "",
  dueDate: "",
  dueTime: "",
};

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  onEdit,
  onDelete,
}: CreateTaskModalProps) => {
  // Load staff options
  const { staffOptions } = useStaffOptions();

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
  } = useModalEditMode<TaskFormData>({
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
      title={getTitle("Create New Task", "Task Details", "Edit Task")}
      submitText={getSubmitText("Create Task")}
      loading={isSubmitting}
      mode={mode}
      isEditMode={isEditMode}
      onEdit={mode === "view" ? handleEdit : undefined}
      onDelete={onDelete}
    >
      <div className="task-form">
        <TaskInformation
          title={formData.title}
          description={formData.description}
          onTitleChange={(value) => setFormData({ ...formData, title: value })}
          onDescriptionChange={(value) =>
            setFormData({ ...formData, description: value })
          }
          isReadOnly={isReadOnly}
        />

        <TaskCategoryPriority
          category={formData.category}
          priority={formData.priority}
          onCategoryChange={(value) =>
            setFormData({ ...formData, category: value })
          }
          onPriorityChange={(value) =>
            setFormData({ ...formData, priority: value })
          }
          isReadOnly={isReadOnly}
        />

        <TaskAssignment
          assignedTo={formData.assignedTo}
          onAssignedToChange={(value) =>
            setFormData({ ...formData, assignedTo: value })
          }
          staffOptions={staffOptions}
          isReadOnly={isReadOnly}
        />

        <TaskSchedule
          dueDate={formData.dueDate}
          dueTime={formData.dueTime}
          onDueDateChange={(value) =>
            setFormData({ ...formData, dueDate: value })
          }
          onDueTimeChange={(value) =>
            setFormData({ ...formData, dueTime: value })
          }
          isReadOnly={isReadOnly}
        />
      </div>
    </FormModal>
  );
};
