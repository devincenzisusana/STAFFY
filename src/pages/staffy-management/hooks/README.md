# Custom Hooks

This directory contains reusable hooks for managing entity CRUD operations and form state.

## Hooks Overview

### `useModalEditMode`

Manages modal form state and transitions between view, edit, and create modes.

**Use when**: You need a modal that can display data in read-only mode and allow editing.

```tsx
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
} = useModalEditMode({
  mode: "view",
  initialData: staffMember,
  defaultFormData: emptyStaffData,
  onSubmit: updateStaff,
  onClose: closeModal,
});
```

**Key Features**:

- Automatic form data synchronization when `initialData` changes
- Prevents accidental form submission during mode transitions
- Handles cancel behavior (reverts to view mode without saving)
- Smart title and button text generation

### `useEntityManagement`

Manages CRUD operations and modal states for entity management pages.

**Use when**: You have a list/table of entities and need create/view/edit/delete operations.

```tsx
const {
  isCreateModalOpen,
  isViewModalOpen,
  selectedEntity,
  handleCreate,
  handleSubmit,
  handleRowClick,
  handleDelete,
  confirmDelete,
  closeCreateModal,
  closeViewModal,
} = useEntityManagement({
  onSubmit: createEntity,
  onEdit: editEntity,
  onDelete: deleteEntity,
});
```

### `useEntityFilters`

Manages search and filtering state for entity lists.

**Use when**: You need to filter and search through a list of entities.

```tsx
const { searchQuery, setSearchQuery, filters, setFilter, filteredData } =
  useEntityFilters(entities, {
    searchFields: ["name", "email"],
    filterFields: [{ field: "status", values: ["active", "inactive"] }],
  });
```

## Complete Example: Entity Management Page

```tsx
import { useState, useEffect } from "react";
import {
  useEntityManagement,
  useEntityFilters,
  useModalEditMode,
} from "./hooks";

export const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);

  // Load data
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    const data = await staffService.fetchAllStaff();
    setStaffData(data);
  };

  // Entity management
  const {
    isCreateModalOpen,
    isViewModalOpen,
    selectedEntity: selectedStaff,
    handleCreate,
    handleSubmit,
    handleRowClick,
    handleDelete,
    closeCreateModal,
    closeViewModal,
  } = useEntityManagement({
    onSubmit: async (data) => {
      await staffService.createStaffMember(data);
      await loadStaff();
    },
    onDelete: async (staff) => {
      await staffService.deleteStaffMember(staff.id);
      await loadStaff();
    },
  });

  // Filtering
  const { filteredData } = useEntityFilters(staffData, {
    searchFields: ["name"],
  });

  return (
    <>
      <Button onClick={handleCreate}>Add Staff</Button>
      <Table data={filteredData} onRowClick={handleRowClick} />

      {/* Create Modal */}
      <StaffModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleSubmit}
        mode="create"
      />

      {/* View/Edit Modal */}
      {selectedStaff && (
        <StaffModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          initialData={selectedStaff}
          onSubmit={async (data) => {
            await staffService.updateStaffMember(selectedStaff.id, data);
            await loadStaff();
          }}
          onDelete={handleDelete}
          mode="view"
        />
      )}
    </>
  );
};
```

## Best Practices

1. **Separation of Concerns**: Keep data fetching, state management, and UI rendering separate
2. **Type Safety**: Always provide proper TypeScript types for your entities and form data
3. **Error Handling**: Wrap async operations in try-catch blocks
4. **Loading States**: Show loading indicators during async operations
5. **Optimistic Updates**: Consider optimistic UI updates for better UX
6. **Data Refresh**: Always reload data after successful CRUD operations
7. **Form Validation**: Validate form data before submission
8. **GDPR Compliance**: Handle consent properly in forms that collect personal data

## Hook Dependencies

```
useModalEditMode (standalone)
useEntityManagement (standalone)
useEntityFilters (standalone)
```

These hooks are independent and can be used separately or together based on your needs.
