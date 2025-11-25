import {
  RiUserAddLine,
  RiCalendarLine,
  RiTaskLine,
  RiMailSendLine,
  RiRefreshLine,
} from "react-icons/ri";
import "./QuickStartGuide.css";

export const QuickStartGuide = () => {
  const steps = [
    {
      number: 1,
      icon: <RiUserAddLine />,
      title: "Add Your Staff",
      description:
        "Navigate to the Staff page and click 'Add Staff' to create employee profiles. Include their personal information, contact details, and role assignment.",
      tips: [
        "For Gmail users, authentication is automatic via Google OAuth",
        "For other emails, a temporary password will be generated",
        "Assign roles: Admin Operator for managers, Staff Operator for employees",
      ],
    },
    {
      number: 2,
      icon: <RiCalendarLine />,
      title: "Create Work Schedules",
      description:
        "Go to the Schedule page and click 'Create Schedule' to assign shifts. Choose the date range, shift times, location, and assign to staff members.",
      tips: [
        "Use Month view for overview, Week view for detailed planning",
        "Grid view shows all schedules in a sortable table format",
        "Duplicate schedule validation prevents conflicts",
        "Support for multi-day schedules (e.g., Oct 27 - Oct 30)",
      ],
    },
    {
      number: 3,
      icon: <RiMailSendLine />,
      title: "Send Schedules to Staff",
      description:
        "Click 'Send Calendar' to email schedules to your team. Select staff members, schedule statuses, and add a custom message. Beautiful, mobile-responsive emails are sent automatically.",
      tips: [
        "Filter by status: Scheduled, Confirmed, Cancelled, Completed",
        "Select multiple staff members at once",
        "Emails display venue name, shift times, and important reminders",
      ],
    },
    {
      number: 4,
      icon: <RiTaskLine />,
      title: "Assign Tasks",
      description:
        "Navigate to Task Assignment and create tasks for your team. Set priorities (Urgent, High, Medium, Low), assign staff members, and track progress.",
      tips: [
        "Categories: Cleaning, Bar Service, Security, Maintenance, Event Setup",
        "Real-time status updates: Pending, In Progress, Completed, Cancelled",
        "Filter and search tasks to stay organized",
      ],
    },
    {
      number: 5,
      icon: <RiRefreshLine />,
      title: "Real-Time Updates",
      description:
        "All changes are instantly synchronized across all users. When you update a schedule, task, or staff record, everyone sees the changes immediately without refreshing.",
      tips: [
        "Multiple users can work simultaneously",
        "No manual refresh needed",
        "Changes appear instantly on all devices",
      ],
    },
  ];

  return (
    <div className="quick-start-guide">
      <div className="guide-header">
        <h3>Quick Start Guide</h3>
        <p>Follow these steps to get started with Staffy Management System</p>
      </div>

      <div className="guide-steps">
        {steps.map((step) => (
          <div key={step.number} className="guide-step">
            <div className="step-header">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h4>{step.title}</h4>
            </div>
            <p className="step-description">{step.description}</p>
            <ul className="step-tips">
              {step.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
