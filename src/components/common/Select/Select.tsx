import { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiCheckLine } from "react-icons/ri";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export const Select = ({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  fullWidth = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`select-wrapper ${fullWidth ? "select-full-width" : ""}`}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <div
        ref={selectRef}
        className={`select-container ${isOpen ? "is-open" : ""} ${
          error ? "has-error" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        <button
          type="button"
          className="select-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span
            className={`select-value ${
              !selectedOption ? "is-placeholder" : ""
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <RiArrowDownSLine className="select-arrow" />
        </button>
        {isOpen && (
          <div className="select-dropdown">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`select-option ${
                  option.value === value ? "is-selected" : ""
                } ${option.disabled ? "is-disabled" : ""}`}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <RiCheckLine className="select-check" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="select-error-text">{error}</span>}
      {!error && helperText && (
        <span className="select-helper-text">{helperText}</span>
      )}
    </div>
  );
};
