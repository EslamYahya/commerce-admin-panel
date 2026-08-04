export interface Order {
  id: number;
  customerName: string;
  productId: number;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
}
