import { useState, useRef, useEffect } from "react";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import { SelectOption } from "./Select";
import "./SearchableSelect.css";

interface SearchableSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export const SearchableSelect = ({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  disabled = false,
  required = false,
  fullWidth = false,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
  };

  return (
    <div
      className={`searchable-select-wrapper ${
        fullWidth ? "searchable-select-full-width" : ""
      }`}
    >
      {label && (
        <label className="searchable-select-label">
          {label}
          {required && <span className="searchable-select-required">*</span>}
        </label>
      )}
      <div
        ref={selectRef}
        className={`searchable-select-container ${isOpen ? "is-open" : ""} ${
          error ? "has-error" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        <button
          type="button"
          className="searchable-select-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span
            className={`searchable-select-value ${
              !selectedOption ? "is-placeholder" : ""
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption && !disabled && (
            <button
              type="button"
              className="searchable-select-clear"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <RiCloseLine />
            </button>
          )}
        </button>
        {isOpen && (
          <div className="searchable-select-dropdown">
            <div className="searchable-select-search">
              <RiSearchLine className="searchable-select-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="searchable-select-search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="searchable-select-options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`searchable-select-option ${
                      option.value === value ? "is-selected" : ""
                    } ${option.disabled ? "is-disabled" : ""}`}
                    onClick={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                    disabled={option.disabled}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="searchable-select-no-results">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <span className="searchable-select-error-text">{error}</span>}
      {!error && helperText && (
        <span className="searchable-select-helper-text">{helperText}</span>
      )}
    </div>
  );
};
