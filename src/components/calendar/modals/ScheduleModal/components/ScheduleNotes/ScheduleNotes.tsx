import { Textarea } from "@/components/common/Input";
import { RiFileTextLine } from "react-icons/ri";

interface ScheduleNotesProps {
  notes: string;
  onNotesChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const ScheduleNotes = ({
  notes,
  onNotesChange,
  isReadOnly = false,
}: ScheduleNotesProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Additional Notes</h3>
      <Textarea
        label="Notes"
        placeholder="Add any additional notes about this schedule..."
        value={notes}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onNotesChange(e.target.value)
        }
        icon={<RiFileTextLine />}
        disabled={isReadOnly}
        rows={4}
        fullWidth
      />
    </div>
  );
};
