import { ReactNode } from "react";
import "./SummaryBox.css";

interface SummaryBoxProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

export const SummaryBox = ({
  label,
  value,
  icon,
  variant = "default",
}: SummaryBoxProps) => {
  return (
    <div className={`summary-box summary-box--${variant}`}>
      {icon && <div className="summary-box__icon">{icon}</div>}
      <div className="summary-box__content">
        <span className="summary-box__label">{label}</span>
        <span className="summary-box__value">{value}</span>
      </div>
    </div>
  );
};
