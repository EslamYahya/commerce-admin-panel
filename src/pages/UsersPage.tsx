import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import UsersTable from "@/features/users/components/UsersTable";
import { useUsers } from "@/features/users/hooks/useUsers";

export default function UsersPage() {
  const { data: users, loading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }), [roleFilter, search, users]);

  if (loading) {
    return (
      <div className="p-6 text-slate-500 dark:text-slate-400">
        Loading users...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600 dark:text-red-300">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Customers
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Users
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and understand the people behind every order.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm"><Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><label htmlFor="user-search" className="sr-only">Search users by name or email</label><input
          id="user-search"
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pr-3.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500"
        /></div>
        <label htmlFor="user-role-filter" className="sr-only">
          Filter users by role
        </label>
        <select
          id="user-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <p aria-live="polite" className="text-sm text-slate-500 dark:text-slate-400 md:ml-auto">{filteredUsers.length} user{filteredUsers.length === 1 ? "" : "s"}</p>
      </div>
      {filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No users match the selected filters.
        </div>
      ) : (
        <UsersTable users={filteredUsers} />
      )}
    </div>
  );
}
