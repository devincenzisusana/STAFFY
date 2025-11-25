import "./StatusBadgeSelect.css";

export interface StatusOption {
  value: string;
  label: string;
  variant: "success" | "warning" | "error" | "neutral";
}

interface StatusBadgeSelectProps {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const variantStyles = {
  success: { color: "#10b981", background: "#d1fae5" },
  warning: { color: "#f59e0b", background: "#fef3c7" },
  error: { color: "#ef4444", background: "#fee2e2" },
  neutral: { color: "#6b7280", background: "#f3f4f6" },
};

export const StatusBadgeSelect = ({
  value,
  options,
  onChange,
  disabled = false,
}: StatusBadgeSelectProps) => {
  const currentOption = options.find((opt) => opt.value === value);
  const style = currentOption
    ? variantStyles[currentOption.variant]
    : variantStyles.neutral;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    const currentIndex = options.findIndex((opt) => opt.value === value);
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex].value);
  };

  if (disabled) {
    return (
      <span
        className="status-badge"
        style={{
          color: style.color,
          background: style.background,
        }}
      >
        {currentOption?.label || value}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="status-badge status-badge--clickable"
      style={{
        color: style.color,
        background: style.background,
      }}
      onClick={handleClick}
    >
      <span>{currentOption?.label || value}</span>
    </button>
  );
};
