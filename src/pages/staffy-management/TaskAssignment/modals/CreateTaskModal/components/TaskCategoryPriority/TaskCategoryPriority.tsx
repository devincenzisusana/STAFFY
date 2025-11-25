import { Select } from "@/components/common/Select";
import {
  TASK_CATEGORY_OPTIONS,
  TASK_PRIORITY_OPTIONS,
} from "../../../../constants/taskConstants";

interface TaskCategoryPriorityProps {
  category: string;
  priority: string;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const TaskCategoryPriority = ({
  category,
  priority,
  onCategoryChange,
  onPriorityChange,
  isReadOnly = false,
}: TaskCategoryPriorityProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Category & Priority</h3>
      <div className="form-row">
        <Select
          label="Task Category"
          options={TASK_CATEGORY_OPTIONS}
          value={category}
          onChange={onCategoryChange}
          disabled={isReadOnly}
          required
          fullWidth
        />
        <Select
          label="Priority"
          options={TASK_PRIORITY_OPTIONS}
          value={priority}
          onChange={onPriorityChange}
          disabled={isReadOnly}
          required
          fullWidth
        />
      </div>
    </div>
  );
};
