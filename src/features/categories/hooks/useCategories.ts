import { useSyncExternalStore } from "react";
import { getCategories, slugify } from "../api";
import type { Category } from "../types";

interface UseCategoriesResult {
  data: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, "id" | "slug" | "createdAt">) => void;
  updateCategory: (
    id: number,
    category: Omit<Category, "id" | "slug" | "createdAt">,
  ) => void;
  deleteCategory: (id: number) => void;
}

export function useCategories(): UseCategoriesResult {
  const snapshot = useSyncExternalStore(
    categoryStore.subscribe,
    categoryStore.getSnapshot,
    categoryStore.getSnapshot,
  );

  return {
    ...snapshot,
    addCategory: categoryStore.add,
    updateCategory: categoryStore.update,
    deleteCategory: categoryStore.remove,
  };
}

type CategorySnapshot = Pick<UseCategoriesResult, "data" | "loading" | "error">;

let snapshot: CategorySnapshot = { data: [], loading: true, error: null };
const listeners = new Set<() => void>();

const categoryStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
  emit() {
    listeners.forEach((listener) => listener());
  },
  set(next: CategorySnapshot) {
    snapshot = next;
    categoryStore.emit();
  },
  async load() {
    try {
      const data = await getCategories();
      categoryStore.set({ data, loading: false, error: null });
    } catch {
      categoryStore.set({
        data: [],
        loading: false,
        error: "Failed to fetch categories. Please try again later.",
      });
    }
  },
  add(category: Omit<Category, "id" | "slug" | "createdAt">) {
    const id = snapshot.data.length
      ? Math.max(...snapshot.data.map((item) => item.id)) + 1
      : 1;
    const newCategory: Category = {
      ...category,
      id,
      slug: slugify(category.name),
      createdAt: new Date().toISOString(),
    };
    categoryStore.set({ ...snapshot, data: [...snapshot.data, newCategory] });
  },
  update(id: number, category: Omit<Category, "id" | "slug" | "createdAt">) {
    categoryStore.set({
      ...snapshot,
      data: snapshot.data.map((item) =>
        item.id === id
          ? { ...item, ...category, slug: slugify(category.name) }
          : item,
      ),
    });
  },
  remove(id: number) {
    categoryStore.set({
      ...snapshot,
      data: snapshot.data.filter((item) => item.id !== id),
    });
  },
};

void categoryStore.load();
