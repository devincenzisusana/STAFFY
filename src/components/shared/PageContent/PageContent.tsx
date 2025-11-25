import { ReactNode } from "react";
import "./PageContent.css";

interface PageContentProps {
  description?: string;
  children: ReactNode;
}

export const PageContent = ({ description, children }: PageContentProps) => {
  return (
    <div className="page-content">
      {description && <p className="page-description">{description}</p>}
      {children}
    </div>
  );
};
