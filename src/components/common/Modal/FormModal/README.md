# FormModal Component

A reusable modal component designed for form interactions with support for **create**, **view**, and **edit** modes.

## Features

- 🔄 **Mode switching**: Seamlessly transition between view and edit modes
- ✅ **Form validation**: Built-in submission handling with error management
- 🎨 **Flexible footer**: Automatic button rendering based on mode
- 🔒 **Read-only protection**: Prevents accidental edits in view mode
- 🗑️ **Delete support**: Optional delete functionality in view mode

## Usage

### Basic Create Modal

```tsx
import { FormModal } from "@/components/common/Modal";

<FormModal
  isOpen={isOpen}
  onClose={closeModal}
  onSubmit={handleCreate}
  title="Create New Item"
  mode="create"
>
  <FormFields />
</FormModal>;
```

### View/Edit Modal

```tsx
import { FormModal } from "@/components/common/Modal";
import { useModalEditMode } from "@/hooks";

const MyModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const {
    isEditMode,
    formData,
    setFormData,
    handleEdit,
    handleClose,
    handleSubmit,
    getTitle,
  } = useModalEditMode({
    mode: "view",
    initialData,
    defaultFormData: emptyForm,
    onSubmit,
    onClose,
  });

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      title={getTitle("Create", "View Details", "Edit Details")}
      mode="view"
      isEditMode={isEditMode}
    >
      <FormFields
        data={formData}
        onChange={setFormData}
        disabled={!isEditMode}
      />
    </FormModal>
  );
};
```

## Props

| Prop         | Type                           | Required | Default    | Description                                    |
| ------------ | ------------------------------ | -------- | ---------- | ---------------------------------------------- |
| `isOpen`     | `boolean`                      | Yes      | -          | Controls modal visibility                      |
| `onClose`    | `() => void`                   | Yes      | -          | Callback when modal closes                     |
| `onSubmit`   | `(e: FormEvent) => void`       | No       | -          | Callback when form is submitted                |
| `onEdit`     | `() => void`                   | No       | -          | Callback when edit button is clicked           |
| `onDelete`   | `() => void`                   | No       | -          | Callback when delete button is clicked         |
| `title`      | `string`                       | Yes      | -          | Modal title                                    |
| `children`   | `ReactNode`                    | Yes      | -          | Form content                                   |
| `size`       | `'sm' \| 'md' \| 'lg' \| 'xl'` | No       | `'md'`     | Modal size                                     |
| `submitText` | `string`                       | No       | Auto       | Custom submit button text                      |
| `cancelText` | `string`                       | No       | `'Cancel'` | Custom cancel button text                      |
| `loading`    | `boolean`                      | No       | `false`    | Shows loading state on submit button           |
| `mode`       | `'create' \| 'edit' \| 'view'` | Yes      | -          | Current modal mode                             |
| `isEditMode` | `boolean`                      | No       | `false`    | Whether currently in edit mode (for view mode) |

## Mode Behavior

### Create Mode (`mode="create"`)

- Shows **Cancel** and **Create** buttons
- All fields are editable
- No delete or edit buttons

### View Mode (`mode="view"`, `isEditMode={false}`)

- Shows **Close** and **Edit** buttons
- Optional **Delete** button (if `onDelete` provided)
- All fields are read-only

### Edit Mode (`mode="view"`, `isEditMode={true}`)

- Shows **Cancel** and **Save Changes** buttons
- All fields are editable
- Clicking Cancel reverts to view mode without saving

## Best Practices

1. **Always use with `useModalEditMode` hook** for view/edit functionality
2. **Provide proper error handling** in your `onSubmit` callback
3. **Disable form fields** based on `isReadOnly` state from the hook
4. **Use type-safe form data** with proper TypeScript interfaces
5. **Handle loading states** to prevent double submissions

## Related

- [`useModalEditMode`](../../../hooks/useModalEditMode.ts) - Hook for managing edit mode state
- [`Modal`](../Modal.tsx) - Base modal component
- [`Button`](../../Button/Button.tsx) - Button component used in footer
