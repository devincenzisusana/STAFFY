import { useState } from "react";

interface UseEntityManagementProps<T, TFormData = any> {
  onSubmit?: (data: TFormData) => Promise<void>;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => Promise<void>;
}

interface UseEntityManagementReturn<T, TFormData = any> {
  // Modal states
  isCreateModalOpen: boolean;
  isViewModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  selectedEntity: T | null;

  // Modal handlers
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openViewModal: (entity: T) => void;
  closeViewModal: () => void;
  openDeleteConfirm: () => void;
  closeDeleteConfirm: () => void;

  // CRUD handlers
  handleCreate: () => void;
  handleSubmit: (data: TFormData) => Promise<void>;
  handleRowClick: (entity: T) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  confirmDelete: () => Promise<void>;
}

export function useEntityManagement<T, TFormData = any>({
  onSubmit,
  onEdit,
  onDelete,
}: UseEntityManagementProps<T, TFormData> = {}): UseEntityManagementReturn<
  T,
  TFormData
> {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<T | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openViewModal = (entity: T) => {
    setSelectedEntity(entity);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const handleCreate = () => {
    openCreateModal();
  };

  const handleSubmit = async (data: TFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    closeCreateModal();
  };

  const handleRowClick = (entity: T) => {
    openViewModal(entity);
  };

  const handleEdit = () => {
    if (onEdit && selectedEntity) {
      onEdit(selectedEntity);
    }
    closeViewModal();
  };

  const handleDelete = () => {
    openDeleteConfirm();
  };

  const confirmDelete = async () => {
    if (onDelete && selectedEntity) {
      await onDelete(selectedEntity);
    }
    closeDeleteConfirm();
    closeViewModal();
  };

  return {
    // States
    isCreateModalOpen,
    isViewModalOpen,
    isDeleteConfirmOpen,
    selectedEntity,

    // Modal handlers
    openCreateModal,
    closeCreateModal,
    openViewModal,
    closeViewModal,
    openDeleteConfirm,
    closeDeleteConfirm,

    // CRUD handlers
    handleCreate,
    handleSubmit,
    handleRowClick,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
