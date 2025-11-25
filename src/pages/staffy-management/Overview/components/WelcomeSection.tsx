import { RiInformationLine } from "react-icons/ri";
import "./WelcomeSection.css";

export const WelcomeSection = () => {
  return (
    <div className="welcome-section">
      <div className="welcome-header">
        <div className="welcome-icon">
          <RiInformationLine />
        </div>
        <div className="welcome-content">
          <h2>Welcome to Staffy Management System</h2>
          <p className="welcome-subtitle">
            Your comprehensive solution for hotel staff management, scheduling,
            and operations
          </p>
        </div>
      </div>

      <div className="welcome-body">
        <div className="system-description">
          <h3>What is Staffy?</h3>
          <p>
            Staffy is a modern, cloud-based management system designed
            specifically for hospitality venues. It streamlines staff
            operations, simplifies scheduling, and enhances communication
            between management and team members. Built with efficiency and ease
            of use in mind, Staffy helps you focus on what matters most —
            providing exceptional service to your guests.
          </p>
        </div>

        <div className="key-features">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h4>Staff Management</h4>
              <p>
                Complete employee database with personal information, contact
                details, and employment records. Add, edit, and manage staff
                members with role-based access control.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h4>Smart Scheduling</h4>
              <p>
                Create and manage work schedules with multiple views (Month,
                Week, Grid). Send schedules directly to staff via email with
                beautiful, mobile-responsive templates.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h4>Task Assignment</h4>
              <p>
                Assign tasks to staff members, set priorities, track progress,
                and ensure nothing falls through the cracks. Real-time updates
                keep everyone informed.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏖️</div>
              <h4>Absence Tracking</h4>
              <p>
                Manage vacation requests, sick days, and other absences.
                Automatic day calculations and status tracking make leave
                management effortless.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h4>Time Control</h4>
              <p>
                Track employee clock-ins, clock-outs, breaks, and overtime.
                Generate accurate reports for payroll and compliance purposes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Reports & Analytics</h4>
              <p>
                Gain insights into staff performance, attendance patterns, and
                operational efficiency with comprehensive reporting tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
