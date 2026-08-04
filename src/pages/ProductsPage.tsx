import { useState } from "react";
import { toast } from "sonner";
import { useProducts } from "@/features/products/hooks/useProducts";
import ProductsTable from "@/features/products/components/ProductsTable";
import ProductForm from "@/features/products/components/ProductForm";
import type { Product } from "@/features/products/types";

function ProductsPage() {
  const { data, loading, error, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [...new Set(data.map((product) => product.category))];

  const filteredProducts = data.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function handleDelete(id: number) {
    const deletedProduct = data.find((product) => product.id === id);
    deleteProduct(id);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    if (deletedProduct) {
      toast.success(`${deletedProduct.name} deleted`);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Loading products...
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-300">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Inventory
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Products
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep your catalog organized and inventory healthy.
          </p>
        </div>
      </div>

      <ProductForm
        key={editingProduct ? editingProduct.id : "new"}
        editingProduct={editingProduct}
        onAdd={addProduct}
        onUpdate={updateProduct}
        onCancelEdit={() => setEditingProduct(null)}
      />

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900 sm:max-w-xs"
        />

        <label htmlFor="product-category-filter" className="sr-only">
          Filter products by category
        </label>
        <select
          id="product-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <p
          aria-live="polite"
          className="text-sm text-slate-500 dark:text-slate-400 sm:ml-auto"
        >
          {filteredProducts.length} product
          {filteredProducts.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No products match the current filters.
        </div>
      ) : (
        <ProductsTable
          products={filteredProducts}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProductsPage;
