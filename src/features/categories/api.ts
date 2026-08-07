import type { Category } from "./types";

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Devices, gadgets, and accessories.",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
    isActive: true,
    createdAt: "2023-01-05",
  },
  {
    id: 2,
    name: "Furniture",
    slug: "furniture",
    description: "Home and office furniture.",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    isActive: true,
    createdAt: "2023-01-08",
  },
  {
    id: 3,
    name: "Stationery",
    slug: "stationery",
    description: "Office and school supplies.",
    imageUrl:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&h=200&fit=crop",
    isActive: false,
    createdAt: "2023-01-10",
  },
];

export function getCategories(): Promise<Category[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 800);
  });
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
