import { ReactNode } from "react";
import { Modal } from "../Modal";
import { Button } from "../../Button";
import "./ListModal.css";

interface ListModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  onItemClick: (item: T) => void;
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
}

export function ListModal<T>({
  isOpen,
  onClose,
  title,
  items,
  onItemClick,
  renderItem,
  emptyMessage = "No items to display",
}: ListModalProps<T>) {
  const handleItemClick = (item: T) => {
    onItemClick(item);
  };

  const footer = (
    <>
      <div />
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
      size="md"
      footer={footer}
    >
      <div className="list-modal-content">
        {items.length === 0 ? (
          <div className="list-modal-empty">{emptyMessage}</div>
        ) : (
          <div className="list-modal-items">
            {items.map((item, index) => (
              <div
                key={index}
                className="list-modal-item"
                onClick={() => handleItemClick(item)}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
