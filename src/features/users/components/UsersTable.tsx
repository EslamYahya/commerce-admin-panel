import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { User } from "../types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UsersTable({
  users,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-170 w-full divide-y divide-slate-200 dark:divide-slate-800">
        <caption className="sr-only">Users</caption>
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/70"
            >
              <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                {user.name}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-violet-100 text-violet-700 dark:bg-violet-200/15 dark:text-violet-200" : "bg-sky-100 text-sky-700 dark:bg-sky-200/15 dark:text-sky-200"}`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-200/15 dark:text-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    aria-label={`Edit ${user.name}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Pencil aria-hidden="true" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserToDelete(user)}
                    aria-label={`Delete ${user.name}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-400/10 dark:hover:text-red-300"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={userToDelete !== null}
        title="Delete user"
        description={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            onDelete(userToDelete.id);
            setUserToDelete(null);
          }
        }}
      />
    </div>
  );
}
