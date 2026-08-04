import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../types";

interface ProductFormProps {
  editingProduct: Product | null;
  onAdd: (product: Omit<Product, "id">) => void;
  onUpdate: (id: number, product: Omit<Product, "id">) => void;
  onCancelEdit: () => void;
}

const emptyFormState = {
  name: "",
  category: "",
  price: "",
  stock: "",
};

function ProductForm({
  editingProduct,
  onAdd,
  onUpdate,
  onCancelEdit,
}: ProductFormProps) {
  const [formData, setFormData] = useState(() =>
    editingProduct
      ? {
          name: editingProduct.name,
          category: editingProduct.category,
          price: String(editingProduct.price),
          stock: String(editingProduct.stock),
        }
      : emptyFormState,
  );
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const name = formData.name.trim();
    const category = formData.category.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (
      !name ||
      !category ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Enter a name and category, a valid price, and a whole-number stock quantity.",
      );
      return;
    }
    setError(null);

    const payload = {
      name,
      category,
      price,
      stock,
    };

    if (editingProduct) {
      onUpdate(editingProduct.id, payload);
      onCancelEdit();
      toast.success("Product updated");
    } else {
      onAdd(payload);
      toast.success("Product added");
    }

    setFormData(emptyFormState);
  }

  const isEditing = editingProduct !== null;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {isEditing ? "Edit product" : "Add product"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEditing
              ? "Update the product details below."
              : "Create a new product entry for your catalog."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex min-w-45 flex-1 flex-col gap-1.5">
          <label
            htmlFor="product-name"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Name
          </label>
          <input
            id="product-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex min-w-45 flex-1 flex-col gap-1.5">
          <label
            htmlFor="product-category"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Category
          </label>
          <input
            id="product-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex min-w-30 flex-col gap-1.5">
          <label
            htmlFor="product-price"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Price
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex min-w-30 flex-col gap-1.5">
          <label
            htmlFor="product-stock"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Stock
          </label>
          <input
            name="stock"
            id="product-stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            {isEditing ? (
              <Save aria-hidden="true" size={16} />
            ) : (
              <Plus aria-hidden="true" size={16} />
            )}
            {isEditing ? "Save Changes" : "Add Product"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}

export default ProductForm;
