import { useSyncExternalStore } from "react";
import { getOrders } from "../api";
import type { Order } from "../types";

interface UseOrdersResult {
  data: Order[];
  loading: boolean;
  error: string | null;
  updateOrderStatus: (id: number, status: Order["status"]) => void;
  deleteOrder: (id: number) => void;
}

export function useOrders(): UseOrdersResult {
  const snapshot = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getSnapshot,
  );

  function updateOrderStatus(id: number, status: Order["status"]) {
    orderStore.updateStatus(id, status);
  }

  function deleteOrder(id: number) {
    orderStore.remove(id);
  }

  return { ...snapshot, updateOrderStatus, deleteOrder };
}

type OrderSnapshot = Pick<UseOrdersResult, "data" | "loading" | "error">;

let snapshot: OrderSnapshot = { data: [], loading: true, error: null };
const listeners = new Set<() => void>();

const orderStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
  emit() {
    listeners.forEach((listener) => listener());
  },
  set(next: OrderSnapshot) {
    snapshot = next;
    orderStore.emit();
  },
  async load() {
    try {
      const data = await getOrders();
      orderStore.set({ data, loading: false, error: null });
    } catch {
      orderStore.set({
        data: [],
        loading: false,
        error: "Failed to fetch orders. Please try again later.",
      });
    }
  },
  updateStatus(id: number, status: Order["status"]) {
    orderStore.set({
      ...snapshot,
      data: snapshot.data.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    });
  },
  remove(id: number) {
    orderStore.set({
      ...snapshot,
      data: snapshot.data.filter((order) => order.id !== id),
    });
  },
};

void orderStore.load();
