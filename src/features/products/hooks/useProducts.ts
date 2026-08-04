import { useSyncExternalStore } from "react";
import { getProducts } from "../api";
import type { Product } from "../types";

interface UseProductsResult {
  data: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Omit<Product, "id">) => void;
  deleteProduct: (id: number) => void;
}

export function useProducts(): UseProductsResult {
  const snapshot = useSyncExternalStore(productStore.subscribe, productStore.getSnapshot, productStore.getSnapshot);

  function addProduct(product: Omit<Product, "id">) {
    productStore.add(product);
  }

  function updateProduct(id: number, product: Omit<Product, "id">) {
    productStore.update(id, product);
  }

  function deleteProduct(id: number) {
    productStore.remove(id);
  }

  return { ...snapshot, addProduct, updateProduct, deleteProduct };
}

type ProductSnapshot = Pick<UseProductsResult, "data" | "loading" | "error">;

let snapshot: ProductSnapshot = { data: [], loading: true, error: null };
const listeners = new Set<() => void>();

const productStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
  emit() {
    listeners.forEach((listener) => listener());
  },
  set(next: ProductSnapshot) {
    snapshot = next;
    productStore.emit();
  },
  async load() {
    try {
      const data = await getProducts();
      productStore.set({ data, loading: false, error: null });
    } catch {
      productStore.set({ data: [], loading: false, error: "Failed to fetch products. Please try again later." });
    }
  },
  add(product: Omit<Product, "id">) {
    const id = snapshot.data.length ? Math.max(...snapshot.data.map((item) => item.id)) + 1 : 1;
    productStore.set({ ...snapshot, data: [...snapshot.data, { ...product, id }] });
  },
  update(id: number, product: Omit<Product, "id">) {
    productStore.set({ ...snapshot, data: snapshot.data.map((item) => (item.id === id ? { ...product, id } : item)) });
  },
  remove(id: number) {
    productStore.set({ ...snapshot, data: snapshot.data.filter((item) => item.id !== id) });
  },
};

void productStore.load();
