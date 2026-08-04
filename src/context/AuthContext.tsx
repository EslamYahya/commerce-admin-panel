import { useState } from "react";
import type { ReactNode } from "react";
import { login as loginRequest } from "@/features/auth/api";
import type { AuthUser } from "@/features/auth/types";
import { AuthContext } from "./auth-context";
import type { AuthContextValue } from "./auth-context";

const STORAGE_KEY = "auth_user";

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredUser(): AuthUser | null {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (
      parsed &&
      typeof parsed === "object" &&
      "email" in parsed &&
      "name" in parsed &&
      typeof parsed.email === "string" &&
      typeof parsed.name === "string"
    ) {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage may be unavailable; authentication simply starts empty.
    }
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  async function login(email: string, password: string) {
    const authUser = await loginRequest(email, password);
    setUser(authUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } catch {
      // The authenticated session remains available until the page is refreshed.
    }
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // State is already cleared even if persistent storage is unavailable.
    }
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
