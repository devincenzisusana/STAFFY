import { ReactNode } from "react";
import { Modal } from "../Modal";
import { Button } from "../../Button";
import "./DetailsModal.css";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  onEdit?: () => void;
  onDelete?: () => void;
  editText?: string;
  deleteText?: string;
}

export const DetailsModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  onEdit,
  onDelete,
  editText = "Edit",
  deleteText = "Delete",
}: DetailsModalProps) => {
  const footer = (
    <>
      {onDelete && (
        <Button variant="danger" onClick={onDelete}>
          {deleteText}
        </Button>
      )}
      {onEdit && (
        <Button variant="primary" onClick={onEdit}>
          {editText}
        </Button>
      )}
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={footer}
    >
      <div className="details-content">{children}</div>
    </Modal>
  );
};
