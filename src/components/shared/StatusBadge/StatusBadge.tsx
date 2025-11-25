import "./StatusBadge.css";

interface StatusBadgeProps {
  status: string;
  variant: "success" | "warning" | "error" | "neutral";
}

const variantStyles = {
  success: { color: "#10b981", background: "#d1fae5" },
  warning: { color: "#f59e0b", background: "#fef3c7" },
  error: { color: "#ef4444", background: "#fee2e2" },
  neutral: { color: "#6b7280", background: "#f3f4f6" },
};

export const StatusBadge = ({ status, variant }: StatusBadgeProps) => {
  const style = variantStyles[variant];

  return (
    <span
      className="status-badge"
      style={{
        color: style.color,
        background: style.background,
      }}
    >
      {status}
    </span>
  );
};
