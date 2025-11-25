import { Modal } from "@/components/common/Modal";
import "./DetailModal.css";

export interface DetailField {
  label: string;
  value: string | number | React.ReactNode;
  span?: 1 | 2; // For grid spanning
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: DetailField[];
}

export const DetailModal = ({
  isOpen,
  onClose,
  title,
  fields,
}: DetailModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="detail-modal-content">
        {fields.map((field, index) => (
          <div
            key={index}
            className={`detail-field ${
              field.span === 2 ? "detail-field-full" : ""
            }`}
          >
            <label className="detail-label">{field.label}</label>
            <div className="detail-value">{field.value}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
