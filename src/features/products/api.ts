import type { Product } from "./types";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 25.99,
    stock: 120,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 79.99,
    stock: 45,
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    price: 149.5,
    stock: 12,
  },
  { id: 4, name: "Desk Lamp", category: "Furniture", price: 34.0, stock: 60 },
  {
    id: 5,
    name: "Notebook Set",
    category: "Stationery",
    price: 8.5,
    stock: 300,
  },
];

export function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 800);
  });
}
