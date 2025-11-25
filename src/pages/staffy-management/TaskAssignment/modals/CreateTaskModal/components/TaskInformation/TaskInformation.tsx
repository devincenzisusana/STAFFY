import { Input, Textarea } from "@/components/common/Input";
import { RiFileTextLine } from "react-icons/ri";

interface TaskInformationProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const TaskInformation = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  isReadOnly = false,
}: TaskInformationProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Task Information</h3>
      <Input
        label="Task Title"
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        icon={<RiFileTextLine />}
        disabled={isReadOnly}
        required
        fullWidth
      />
      <Textarea
        label="Description"
        placeholder="Enter task description (optional)"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onDescriptionChange(e.target.value)
        }
        disabled={isReadOnly}
        rows={4}
        fullWidth
      />
    </div>
  );
};
