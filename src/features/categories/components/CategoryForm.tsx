import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "../types";

interface CategoryFormProps {
  editingCategory: Category | null;
  onAdd: (category: Omit<Category, "id" | "slug" | "createdAt">) => void;
  onUpdate: (
    id: number,
    category: Omit<Category, "id" | "slug" | "createdAt">,
  ) => void;
  onCancelEdit: () => void;
}

const emptyFormState = {
  name: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

function CategoryForm({
  editingCategory,
  onAdd,
  onUpdate,
  onCancelEdit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState(() =>
    editingCategory
      ? {
          name: editingCategory.name,
          description: editingCategory.description,
          imageUrl: editingCategory.imageUrl,
          isActive: editingCategory.isActive,
        }
      : emptyFormState,
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,
      isActive: formData.isActive,
    };

    if (editingCategory) {
      onUpdate(editingCategory.id, payload);
      toast.success(`تم تحديث تصنيف "${payload.name}"`);
      onCancelEdit();
    } else {
      onAdd(payload);
      toast.success(`تم إضافة تصنيف "${payload.name}"`);
    }

    setFormData(emptyFormState);
  }

  const isEditing = editingCategory !== null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-1 min-w-40 flex-col gap-1">
          <label
            htmlFor="category-name"
            className="text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Name
          </label>
          <input
            id="category-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-1 min-w-48 flex-col gap-1">
          <label
            htmlFor="category-image"
            className="text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Image URL
          </label>
          <input
            id="category-image"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <label className="flex items-center gap-2 pb-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="category-description"
          className="text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          Description
        </label>
        <textarea
          id="category-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {isEditing ? "Save Changes" : "Add Category"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CategoryForm;
