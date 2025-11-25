import { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import "./MultiSelect.css";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  maxDisplay?: number;
}

export const MultiSelect = ({
  label,
  error,
  helperText,
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  disabled = false,
  required = false,
  fullWidth = false,
  maxDisplay = 2,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map((opt) => opt.label).join(", ");
    }

    return `${selectedOptions.length} selected`;
  };

  return (
    <div
      className={`multiselect-wrapper ${
        fullWidth ? "multiselect-full-width" : ""
      }`}
    >
      {label && (
        <label className="multiselect-label">
          {label}
          {required && <span className="multiselect-required">*</span>}
        </label>
      )}
      <div
        ref={selectRef}
        className={`multiselect-container ${isOpen ? "is-open" : ""} ${
          error ? "has-error" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        <div
          className="multiselect-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="multiselect-value-container">
            {selectedOptions.length > 0 &&
            selectedOptions.length <= maxDisplay ? (
              <div className="multiselect-tags">
                {selectedOptions.map((option) => (
                  <span key={option.value} className="multiselect-tag">
                    {option.label}
                    <button
                      type="button"
                      className="multiselect-tag-remove"
                      onClick={(e) => handleRemove(option.value, e)}
                    >
                      <RiCloseLine />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span
                className={`multiselect-value ${
                  selectedOptions.length === 0 ? "is-placeholder" : ""
                }`}
              >
                {getDisplayText()}
              </span>
            )}
          </div>
          <RiArrowDownSLine className="multiselect-arrow" />
        </div>
        {isOpen && (
          <div className="multiselect-dropdown">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`multiselect-option ${
                    isSelected ? "is-selected" : ""
                  } ${option.disabled ? "is-disabled" : ""}`}
                  onClick={() => !option.disabled && handleToggle(option.value)}
                  disabled={option.disabled}
                >
                  <span>{option.label}</span>
                  {isSelected && <RiCheckLine className="multiselect-check" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error && <span className="multiselect-error-text">{error}</span>}
      {!error && helperText && (
        <span className="multiselect-helper-text">{helperText}</span>
      )}
    </div>
  );
};
