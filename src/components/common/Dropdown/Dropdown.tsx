import { ReactNode, useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  disabled?: boolean;
}

export const Dropdown = ({
  trigger,
  items,
  align = "left",
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${disabled ? "dropdown-disabled" : ""}`}
    >
      <div className="dropdown-trigger" onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown-menu dropdown-align-${align}`}>
          {items.map((item, index) => (
            <div key={item.key}>
              {item.divider && index > 0 && (
                <div className="dropdown-divider" />
              )}
              <button
                type="button"
                className={`dropdown-item ${
                  item.disabled ? "dropdown-item-disabled" : ""
                } ${item.danger ? "dropdown-item-danger" : ""}`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && (
                  <span className="dropdown-item-icon">{item.icon}</span>
                )}
                <span className="dropdown-item-label">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
