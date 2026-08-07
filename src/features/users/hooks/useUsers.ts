import { useSyncExternalStore } from "react";
import { getUsers } from "../api";
import type { User } from "../types";

interface UseUsersResult {
  data: User[];
  loading: boolean;
  error: string | null;
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: number, user: Omit<User, "id" | "createdAt">) => void;
  deleteUser: (id: number) => void;
}

export function useUsers(): UseUsersResult {
  const snapshot = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    userStore.getSnapshot,
  );

  return {
    ...snapshot,
    addUser: userStore.add,
    updateUser: userStore.update,
    deleteUser: userStore.remove,
  };
}

type UserSnapshot = Pick<UseUsersResult, "data" | "loading" | "error">;

let snapshot: UserSnapshot = { data: [], loading: true, error: null };
const listeners = new Set<() => void>();

const userStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
  emit() {
    listeners.forEach((listener) => listener());
  },
  set(next: UserSnapshot) {
    snapshot = next;
    userStore.emit();
  },
  async load() {
    try {
      const data = await getUsers();
      userStore.set({ data, loading: false, error: null });
    } catch {
      userStore.set({
        data: [],
        loading: false,
        error: "Failed to fetch users. Please try again later.",
      });
    }
  },
  add(user: Omit<User, "id" | "createdAt">) {
    const id = snapshot.data.length
      ? Math.max(...snapshot.data.map((item) => item.id)) + 1
      : 1;
    const newUser: User = { ...user, id, createdAt: new Date().toISOString() };
    userStore.set({ ...snapshot, data: [...snapshot.data, newUser] });
  },
  update(id: number, user: Omit<User, "id" | "createdAt">) {
    userStore.set({
      ...snapshot,
      data: snapshot.data.map((item) =>
        item.id === id ? { ...item, ...user } : item,
      ),
    });
  },
  remove(id: number) {
    userStore.set({
      ...snapshot,
      data: snapshot.data.filter((item) => item.id !== id),
    });
  },
};

void userStore.load();
