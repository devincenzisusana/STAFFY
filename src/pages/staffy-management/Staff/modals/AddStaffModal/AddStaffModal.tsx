import { useState, useCallback } from "react";
import { FormModal } from "@/components/common/Modal";
import { PhotoUpload } from "./components/PhotoUpload";
import { BasicInformation } from "./components/BasicInformation";
import { EmploymentInformation } from "./components/EmploymentInformation";
import { ContactInformation } from "./components/ContactInformation";
import { AddressInformation } from "./components/AddressInformation";
import { EmergencyContact } from "./components/EmergencyContact";
import { GDPRConsent } from "./components/GDPRConsent";
import { useModalEditMode } from "../../../hooks";
import "./AddStaffModal.css";

export interface StaffFormData {
  photo?: File;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  idNumber: string;
  role: string;
  position: string;
  department: string;
  hireDate: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  gdprConsent: boolean;
  gdprConsentDate?: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: StaffFormData) => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
  initialData?: Partial<StaffFormData>;
  mode?: "create" | "view";
}

const defaultFormData: StaffFormData = {
  firstName: "",
  lastName: "",
  email: "",
  employeeId: "",
  idNumber: "",
  role: "",
  position: "",
  department: "",
  hireDate: "",
  phoneNumber: "",
  dateOfBirth: "",
  address: "",
  city: "",
  zipCode: "",
  country: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  gdprConsent: false,
  gdprConsentDate: "",
};

export const AddStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
  initialData,
  mode = "create",
}: AddStaffModalProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo ? URL.createObjectURL(initialData.photo) : null
  );

  // Custom submit handler with GDPR validation
  const handleStaffSubmit = useCallback(
    async (data: StaffFormData) => {
      if (!data.gdprConsent) {
        alert(
          "You must accept responsibility for data processing to continue."
        );
        throw new Error("GDPR consent required");
      }
      if (onSubmit) {
        await onSubmit(data);
      }
    },
    [onSubmit]
  );

  const {
    isEditMode,
    isSubmitting,
    isReadOnly,
    formData,
    setFormData,
    handleEdit,
    handleClose,
    handleSubmit,
    getTitle,
    getSubmitText,
  } = useModalEditMode<StaffFormData>({
    mode,
    initialData,
    defaultFormData,
    onSubmit: handleStaffSubmit,
    onEdit,
    onClose,
  });

  const handlePhotoChange = (file: File) => {
    console.log("[AddStaffModal] Photo changed", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
    setFormData({ ...formData, photo: file });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={getTitle(
        "Add New Staff Member",
        "Staff Member Details",
        "Edit Staff Member"
      )}
      submitText={getSubmitText("Add Staff Member")}
      loading={isSubmitting}
      mode={mode}
      isEditMode={isEditMode}
      onEdit={mode === "view" ? handleEdit : undefined}
      onDelete={onDelete}
      size="lg"
    >
      <div className="staff-form">
        <PhotoUpload
          photoPreview={photoPreview}
          photoUrl={formData.photoUrl}
          onPhotoChange={handlePhotoChange}
          disabled={isReadOnly}
        />

        <BasicInformation
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          employeeId={formData.employeeId}
          idNumber={formData.idNumber}
          onFirstNameChange={(value) =>
            setFormData({ ...formData, firstName: value })
          }
          onLastNameChange={(value) =>
            setFormData({ ...formData, lastName: value })
          }
          onEmailChange={(value) => setFormData({ ...formData, email: value })}
          onEmployeeIdChange={(value) =>
            setFormData({ ...formData, employeeId: value })
          }
          onIdNumberChange={(value) =>
            setFormData({ ...formData, idNumber: value })
          }
          disabled={isReadOnly}
        />

        <div className="form-section">
          <h3 className="form-section-title">User Role</h3>
          <div className="form-row">
            <div style={{ width: "100%" }}>
              <label className="input-label">Role *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={isReadOnly}
                required
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  fontSize: "0.875rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0.5rem",
                  backgroundColor: isReadOnly ? "#f5f5f5" : "#ffffff",
                  cursor: isReadOnly ? "not-allowed" : "pointer",
                }}
              >
                <option value="">Select role</option>
                <option value="admin-operator">Admin</option>
                <option value="staff-operator">Staff</option>
              </select>
            </div>
          </div>
        </div>

        <EmploymentInformation
          position={formData.position}
          department={formData.department}
          hireDate={formData.hireDate}
          onPositionChange={(value) =>
            setFormData({ ...formData, position: value })
          }
          onDepartmentChange={(value) =>
            setFormData({ ...formData, department: value })
          }
          onHireDateChange={(value) =>
            setFormData({ ...formData, hireDate: value })
          }
          disabled={isReadOnly}
        />

        <ContactInformation
          phoneNumber={formData.phoneNumber}
          dateOfBirth={formData.dateOfBirth}
          onPhoneNumberChange={(value) =>
            setFormData({ ...formData, phoneNumber: value })
          }
          onDateOfBirthChange={(value) =>
            setFormData({ ...formData, dateOfBirth: value })
          }
          disabled={isReadOnly}
        />

        <AddressInformation
          address={formData.address}
          city={formData.city}
          zipCode={formData.zipCode}
          country={formData.country}
          onAddressChange={(value) =>
            setFormData({ ...formData, address: value })
          }
          onCityChange={(value) => setFormData({ ...formData, city: value })}
          onZipCodeChange={(value) =>
            setFormData({ ...formData, zipCode: value })
          }
          onCountryChange={(value) =>
            setFormData({ ...formData, country: value })
          }
          disabled={isReadOnly}
        />

        <EmergencyContact
          emergencyContactName={formData.emergencyContactName}
          emergencyContactNumber={formData.emergencyContactNumber}
          onEmergencyContactNameChange={(value) =>
            setFormData({ ...formData, emergencyContactName: value })
          }
          onEmergencyContactNumberChange={(value) =>
            setFormData({ ...formData, emergencyContactNumber: value })
          }
          disabled={isReadOnly}
        />

        <GDPRConsent
          isChecked={formData.gdprConsent}
          onConsentChange={(checked) =>
            setFormData({ ...formData, gdprConsent: checked })
          }
          disabled={isReadOnly}
        />
      </div>
    </FormModal>
  );
};
