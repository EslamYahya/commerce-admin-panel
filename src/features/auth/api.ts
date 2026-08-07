import type { AuthUser } from "./types";

const MOCK_CREDENTIALS = {
  email: import.meta.env.VITE_MOCK_EMAIL ?? "admin@example.com",
  password: import.meta.env.VITE_MOCK_PASSWORD ?? "123456",
};

export function login(email: string, password: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email === MOCK_CREDENTIALS.email &&
        password === MOCK_CREDENTIALS.password
      ) {
        resolve({ email, name: "Admin User" });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
}
