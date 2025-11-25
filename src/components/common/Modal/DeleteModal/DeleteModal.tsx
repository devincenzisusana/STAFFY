import { Modal } from "../Modal";
import { Button } from "../../Button";
import { RiDeleteBinLine } from "react-icons/ri";
import "./DeleteModal.css";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  message: string;
  itemName?: string;
  deleteText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  title = "Delete Confirmation",
  message,
  itemName,
  deleteText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: DeleteModalProps) => {
  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant="danger" onClick={onDelete} loading={loading}>
        {deleteText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={footer}
      closeOnOverlayClick={!loading}
    >
      <div className="delete-content">
        <div className="delete-icon">
          <RiDeleteBinLine />
        </div>
        <p className="delete-message">{message}</p>
        {itemName && (
          <div className="delete-item-name">
            <strong>{itemName}</strong>
          </div>
        )}
        <p className="delete-warning">This action cannot be undone.</p>
      </div>
    </Modal>
  );
};
