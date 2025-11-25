import { useEffect } from "react";
import {
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiCloseLine,
} from "react-icons/ri";
import "./Toast.css";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <RiCheckLine className="toast-icon" />;
      case "error":
        return <RiErrorWarningLine className="toast-icon" />;
      case "warning":
        return <RiErrorWarningLine className="toast-icon" />;
      case "info":
      default:
        return <RiInformationLine className="toast-icon" />;
    }
  };

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-content">
        {getIcon()}
        <p className="toast-message">{message}</p>
      </div>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <RiCloseLine />
      </button>
    </div>
  );
};
