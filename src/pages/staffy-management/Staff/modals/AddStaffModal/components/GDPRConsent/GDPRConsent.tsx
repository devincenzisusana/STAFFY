import "./GDPRConsent.css";

interface GDPRConsentProps {
  isChecked: boolean;
  onConsentChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const GDPRConsent = ({
  isChecked,
  onConsentChange,
  disabled = false,
}: GDPRConsentProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Data Protection</h3>
      <div className="gdpr-section">
        <label className="gdpr-label">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="gdpr-checkbox"
            disabled={disabled}
          />
          <div className="gdpr-content">
            <strong>GDPR Consent Required</strong>
            <p>
              I confirm that I have the legal authority to process and store
              this staff member's personal data in accordance with GDPR
              regulations. The data will be retained for 7 years from the date
              of entry or as required by law.
            </p>
            {!disabled && (
              <p className="gdpr-warning">
                You must accept responsibility for data processing to continue.
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};
