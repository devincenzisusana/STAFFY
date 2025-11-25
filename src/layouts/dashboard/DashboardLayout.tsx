import { ReactNode, useState } from "react";
import { Sidebar, MenuItem } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/shared/PageHeader";
import "./DashboardLayout.css";

interface DashboardLayoutProps {
  children: ReactNode;
  menuItems: MenuItem[];
  pageTitle: string;
  pageIcon?: React.ComponentType<{ className?: string }>;
  pageDescription?: string;
  headerActions?: ReactNode;
}

export const DashboardLayout = ({
  children,
  menuItems,
  pageTitle,
  pageIcon,
  pageDescription,
  headerActions,
}: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar
        menuItems={menuItems}
        isCollapsed={isCollapsed}
        onToggle={setIsCollapsed}
      />
      <div className={`dashboard-main ${isCollapsed ? "collapsed" : ""}`}>
        <main className="dashboard-content">
          <PageHeader
            title={pageTitle}
            icon={pageIcon}
            description={pageDescription}
            actions={headerActions}
          />
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
