import { Input } from "@/components/common/Input";
import { RiMapPinLine } from "react-icons/ri";

interface AddressInformationProps {
  address: string;
  city: string;
  zipCode: string;
  country: string;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  disabled?: boolean;
}

export const AddressInformation = ({
  address,
  city,
  zipCode,
  country,
  onAddressChange,
  onCityChange,
  onZipCodeChange,
  onCountryChange,
  disabled = false,
}: AddressInformationProps) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Address Information</h3>
      <Input
        label="Address"
        type="text"
        placeholder="Enter street address"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        icon={<RiMapPinLine />}
        required
        fullWidth
        disabled={disabled}
      />
      <div className="form-row form-row-three">
        <Input
          label="City"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Zip Code"
          type="text"
          placeholder="Zip code"
          value={zipCode}
          onChange={(e) => onZipCodeChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
        <Input
          label="Country"
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          required
          fullWidth
          disabled={disabled}
        />
      </div>
    </div>
  );
};
