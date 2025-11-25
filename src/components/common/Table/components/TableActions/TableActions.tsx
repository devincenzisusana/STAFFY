import { ReactNode } from "react";
import { Dropdown, DropdownItem } from "../../../Dropdown";
import { Button } from "../../../Button";
import { RiMoreLine } from "react-icons/ri";
import "./TableActions.css";

export interface TableAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface TableActionsProps {
  actions: TableAction[];
  variant?: "dropdown" | "buttons";
  size?: "sm" | "md" | "lg";
}

export const TableActions = ({
  actions,
  variant = "dropdown",
  size = "sm",
}: TableActionsProps) => {
  if (variant === "buttons") {
    return (
      <div className="table-actions-buttons">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.danger ? "danger" : "outline"}
            size={size}
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </div>
    );
  }

  const dropdownItems: DropdownItem[] = actions.map((action) => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    onClick: action.onClick,
    disabled: action.disabled,
    danger: action.danger,
    divider: action.divider,
  }));

  return (
    <div className="table-actions-dropdown">
      <Dropdown
        trigger={<Button variant="outline" size={size} icon={<RiMoreLine />} />}
        items={dropdownItems}
        align="right"
      />
    </div>
  );
};
