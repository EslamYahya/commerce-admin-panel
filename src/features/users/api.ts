import type { User } from "./types";

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    createdAt: "2023-01-01",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    createdAt: "2023-01-02",
    isActive: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    createdAt: "2023-01-03",
    isActive: false,
  },
];

export function getUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 800);
  });
}