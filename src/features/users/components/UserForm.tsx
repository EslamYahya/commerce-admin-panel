import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../types";

interface UserFormProps {
  editingUser: User | null;
  onAdd: (user: Omit<User, "id" | "createdAt">) => void;
  onUpdate: (id: number, user: Omit<User, "id" | "createdAt">) => void;
  onCancelEdit: () => void;
}

const emptyFormState = {
  name: "",
  email: "",
  role: "user" as User["role"],
  isActive: true,
};

function UserForm({
  editingUser,
  onAdd,
  onUpdate,
  onCancelEdit,
}: UserFormProps) {
  const [formData, setFormData] = useState(() =>
    editingUser
      ? {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          isActive: editingUser.isActive,
        }
      : emptyFormState,
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      email: formData.email,
      role: formData.role,
      isActive: formData.isActive,
    };

    if (editingUser) {
      onUpdate(editingUser.id, payload);
      toast.success(`Updated "${payload.name}"`);
      onCancelEdit();
    } else {
      onAdd(payload);
      toast.success(`Added "${payload.name}"`);
    }

    setFormData(emptyFormState);
  }

  const isEditing = editingUser !== null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="user-name"
          className="text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          Name
        </label>
        <input
          id="user-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="user-email"
          className="text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          Email
        </label>
        <input
          id="user-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="user-role"
          className="text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          Role
        </label>
        <select
          id="user-role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
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

      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {isEditing ? "Save Changes" : "Add User"}
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
    </form>
  );
}

export default UserForm;
