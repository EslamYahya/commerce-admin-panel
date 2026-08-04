import type { User } from "../types";
interface UsersTableProps {
  users: User[];
}
export default function UsersTable({ users }: UsersTableProps) {
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
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-200/15 dark:text-violet-200"
                      : "bg-sky-100 text-sky-700 dark:bg-sky-200/15 dark:text-sky-200"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-200/15 dark:text-emerald-200"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
