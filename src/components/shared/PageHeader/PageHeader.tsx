import { ReactNode } from "react";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = ({
  title,
  icon: Icon,
  description,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="page-header">
      <div className="page-header-left">
        {Icon && <Icon className="page-header-icon" />}
        <div className="page-header-content">
          <h1 className="page-header-title">{title}</h1>
          {description && (
            <p className="page-header-description">{description}</p>
          )}
        </div>
      </div>
      <div className="page-header-right">
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
};
