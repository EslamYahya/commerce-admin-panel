import type { AuthUser } from "./types";

const MOCK_CREDENTIALS = {
  email: "admin@example.com",
  password: "123456",
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
