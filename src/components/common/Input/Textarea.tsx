import { TextareaHTMLAttributes } from "react";
import "./Textarea.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export const Textarea = ({
  label,
  error,
  helperText,
  fullWidth = false,
  resize = "vertical",
  className = "",
  id,
  ...props
}: TextareaProps) => {
  const textareaId =
    id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className={`textarea-wrapper ${fullWidth ? "textarea-full-width" : ""}`}
    >
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {props.required && <span className="textarea-required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`textarea-field textarea-resize-${resize} ${
          error ? "has-error" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="textarea-error-text">{error}</span>}
      {!error && helperText && (
        <span className="textarea-helper-text">{helperText}</span>
      )}
    </div>
  );
};
