import { InputHTMLAttributes, ReactNode } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  helperText,
  icon,
  fullWidth = false,
  className = "",
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`input-wrapper ${fullWidth ? "input-full-width" : ""}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <div
        className={`input-container ${icon ? "has-icon" : ""} ${
          error ? "has-error" : ""
        }`}
      >
        {icon && <span className="input-icon">{icon}</span>}
        <input id={inputId} className={`input-field ${className}`} {...props} />
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {!error && helperText && (
        <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
};
