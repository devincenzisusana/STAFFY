import { Button } from "@/components/common/Button";
import { RiUploadLine } from "react-icons/ri";
import "./PhotoUpload.css";

interface PhotoUploadProps {
  photoPreview: string | null;
  photoUrl?: string;
  onPhotoChange: (file: File) => void;
  disabled?: boolean;
}

export const PhotoUpload = ({
  photoPreview,
  photoUrl,
  onPhotoChange,
  disabled = false,
}: PhotoUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, PNG, and GIF formats are supported");
        return;
      }

      onPhotoChange(file);
    }
  };

  return (
    <div className="staff-photo-section">
      <div className="staff-photo-preview">
        {photoPreview || photoUrl ? (
          <img src={photoPreview || photoUrl} alt="Staff preview" />
        ) : (
          <div className="staff-photo-placeholder">??</div>
        )}
      </div>
      {!disabled && (
        <div className="staff-photo-upload">
          <input
            type="file"
            id="staff-photo"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<RiUploadLine />}
            onClick={() => document.getElementById("staff-photo")?.click()}
          >
            Upload Photo
          </Button>
          <p className="staff-photo-hint">
            Max size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
};
