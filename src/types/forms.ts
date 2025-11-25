/**
 * Common types for form modals and CRUD operations
 */

/**
 * Base interface for entities with common fields
 */
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Modal modes for form interactions
 */
export type ModalMode = "create" | "view" | "edit";

/**
 * Generic form modal props that can be extended for specific use cases
 */
export interface BaseFormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: T) => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
  initialData?: Partial<T>;
  mode?: ModalMode;
}

/**
 * Standard form field props for consistent form component patterns
 */
export interface BaseFormFieldProps {
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

/**
 * CRUD operation handlers for entity management
 */
export interface CrudHandlers<T, TFormData = T> {
  onCreate?: (data: TFormData) => Promise<void>;
  onRead?: (id: string) => Promise<T>;
  onUpdate?: (id: string, data: TFormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

/**
 * Service interface for entity operations
 */
export interface EntityService<T, TFormData = T> {
  fetchAll: () => Promise<T[]>;
  fetchById: (id: string) => Promise<T>;
  create: (data: TFormData) => Promise<T>;
  update: (id: string, data: TFormData) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

/**
 * Filter configuration for entity lists
 */
export interface FilterConfig<T> {
  field: keyof T;
  values: any[];
}

/**
 * Common form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
