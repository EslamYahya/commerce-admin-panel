import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import CategoriesTable from "@/features/categories/components/CategoriesTable";
import CategoryForm from "@/features/categories/components/CategoryForm";
import { useDebounce } from "@/hooks/useDebounce";
import type { Category } from "@/features/categories/types";

function CategoriesPage() {
  const {
    data: categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [categories, debouncedSearch],
  );

  function handleDelete(id: number) {
    deleteCategory(id);
    if (editingCategory?.id === id) {
      setEditingCategory(null);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Loading categories...
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Organize your products into categories.
        </p>
      </div>

      <CategoryForm
        key={editingCategory ? editingCategory.id : "new"}
        editingCategory={editingCategory}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onCancelEdit={() => setEditingCategory(null)}
      />

      <div className="relative w-full max-w-xs">
        <Search
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <label htmlFor="category-search" className="sr-only">
          Search categories
        </label>
        <input
          id="category-search"
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No categories match your search.
        </p>
      ) : (
        <CategoriesTable
          categories={filteredCategories}
          onEdit={setEditingCategory}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default CategoriesPage;
