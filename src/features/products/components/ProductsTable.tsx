import { useMemo, useState } from "react";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

type SortKey = "name" | "category" | "price" | "stock";
type SortDirection = "ascending" | "descending";

const PAGE_SIZE = 5;

function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("ascending");
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        const comparison =
          typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue));
        return sortDirection === "ascending" ? comparison : -comparison;
      }),
    [products, sortDirection, sortKey],
  );
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleProducts = sortedProducts.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  function handleSort(nextSortKey: SortKey) {
    setCurrentPage(1);
    if (nextSortKey === sortKey) {
      setSortDirection((direction) =>
        direction === "ascending" ? "descending" : "ascending",
      );
      return;
    }
    setSortKey(nextSortKey);
    setSortDirection("ascending");
  }

  function getSortDirection(key: SortKey) {
    return sortKey === key ? sortDirection : "none";
  }

  function confirmDeletion() {
    if (!productToDelete) return;
    onDelete(productToDelete.id);
    setProductToDelete(null);
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-180 w-full text-left text-sm">
        <caption className="sr-only">Products</caption>
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <tr>
            {(
              [
                ["name", "Name"],
                ["category", "Category"],
                ["price", "Price"],
                ["stock", "Stock"],
              ] as const
            ).map(([key, label]) => (
              <th
                key={key}
                scope="col"
                aria-sort={getSortDirection(key)}
                className="px-4 py-3 font-semibold"
              >
                <button
                  type="button"
                  onClick={() => handleSort(key)}
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {label} <ArrowUpDown aria-hidden="true" size={14} />
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleProducts.map((product) => (
            <tr
              key={product.id}
              className="text-slate-700 transition-colors hover:bg-slate-50/80 dark:text-slate-200 dark:hover:bg-slate-900/70"
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                {product.name}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                {product.category}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">{product.stock}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  >
                    <Pencil aria-hidden="true" size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductToDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/70"
                  >
                    <Trash2 aria-hidden="true" size={14} /> Delete
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
        totalItems={sortedProducts.length}
        onPageChange={setCurrentPage}
      />
      <ConfirmDialog
        open={productToDelete !== null}
        title="Delete product?"
        description={`This will remove ${productToDelete?.name ?? "this product"} from the catalog. This demo action cannot be undone.`}
        onConfirm={confirmDeletion}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
}

export default ProductsTable;
