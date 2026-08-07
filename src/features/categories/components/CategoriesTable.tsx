import { useMemo, useState } from "react";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Category } from "../types";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

type SortKey = "name" | "createdAt";
const PAGE_SIZE = 5;

function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((first, second) => {
        const result = String(first[sortKey]).localeCompare(
          String(second[sortKey]),
        );
        return ascending ? result : -result;
      }),
    [ascending, categories, sortKey],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedCategories.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleCategories = sortedCategories.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  function sortBy(key: SortKey) {
    setCurrentPage(1);
    if (key === sortKey) setAscending((value) => !value);
    else {
      setSortKey(key);
      setAscending(true);
    }
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-160 w-full text-left text-sm">
        <caption className="sr-only">Categories</caption>
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              <span className="sr-only">Image</span>
            </th>
            <th
              scope="col"
              aria-sort={
                sortKey === "name"
                  ? ascending
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              className="px-4 py-3 font-semibold"
            >
              <button
                type="button"
                onClick={() => sortBy("name")}
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
              >
                Name <ArrowUpDown aria-hidden="true" size={14} />
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Description
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th
              scope="col"
              aria-sort={
                sortKey === "createdAt"
                  ? ascending
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              className="px-4 py-3 font-semibold"
            >
              <button
                type="button"
                onClick={() => sortBy("createdAt")}
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
              >
                Created <ArrowUpDown aria-hidden="true" size={14} />
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleCategories.map((category) => (
            <tr
              key={category.id}
              className="text-slate-700 transition-colors hover:bg-slate-50/80 dark:text-slate-200 dark:hover:bg-slate-900/70"
            >
              <td className="px-4 py-3">
                <img
                  src={category.imageUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                  loading="lazy"
                />
              </td>
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                {category.name}
                <div className="text-xs font-normal text-slate-400">
                  /{category.slug}
                </div>
              </td>
              <td className="max-w-70 truncate px-4 py-3 dark:text-slate-200">
                {category.description || "—"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    category.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-200/15 dark:text-emerald-200"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Pencil aria-hidden="true" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(category)}
                    aria-label={`Delete ${category.name}`}
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

      <Pagination
        currentPage={safeCurrentPage}
        pageSize={PAGE_SIZE}
        totalItems={sortedCategories.length}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={categoryToDelete !== null}
        title="Delete category"
        description={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            onDelete(categoryToDelete.id);
            setCategoryToDelete(null);
          }
        }}
      />
    </div>
  );
}

export default CategoriesTable;
