import type { Order } from "./types";

const mockOrders: Order[] = [
  {
    id: 1,
    customerName: "John Doe",
    productId: 1,
    quantity: 2,
    totalPrice: 51.98,
    status: "pending",
    orderDate: "2023-04-01",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    productId: 2,
    quantity: 1,
    totalPrice: 79.99,
    status: "shipped",
    orderDate: "2023-04-02",
  },
  {
    id: 3,
    customerName: "Bob Smith",
    productId: 3,
    quantity: 1,
    totalPrice: 149.5,
    status: "delivered",
    orderDate: "2023-04-02",
  },
  {
    id: 4,
    customerName: "Bob Johnson",
    productId: 5,
    quantity: 1,
    totalPrice: 8.5,
    status: "cancelled",
    orderDate: "2023-04-02",
  },
];

export function getOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 800);
  });
}
