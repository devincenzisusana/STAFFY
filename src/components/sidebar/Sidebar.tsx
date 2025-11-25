import { NavLink, useNavigate } from "react-router-dom";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import "./Sidebar.css";

export interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export const Sidebar = ({ menuItems, isCollapsed, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const { userName, tenantName } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      navigate("/login");
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
    }
  };

  const toggleSidebar = () => {
    onToggle(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">{tenantName || "STAFFY"}</h1>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <RiArrowRightSLine className="toggle-icon" />
          ) : (
            <RiArrowLeftSLine className="toggle-icon" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="sidebar-welcome">
            <span className="welcome-text">Welcome, {userName || "User"}</span>
          </div>
          <div className="sidebar-divider"></div>
        </>
      )}

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
            >
              <IconComponent className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-signout" onClick={handleSignOut}>
          {isCollapsed ? (
            <RiLogoutBoxLine className="signout-icon" />
          ) : (
            <span>Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
};
