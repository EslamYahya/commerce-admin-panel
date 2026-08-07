import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useProducts } from "@/features/products/hooks/useProducts";
import OrdersTable from "@/features/orders/components/OrdersTable";
import { useDebounce } from "@/hooks/useDebounce";
import type { Order } from "@/features/orders/types";

function OrdersPage() {
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    updateOrderStatus,
    deleteOrder,
  } = useOrders();
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [statusFilter, setStatusFilter] = useState("all");

  const productsMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    [products],
  );

  const filteredOrders = useMemo(() => {
    const normalizedQuery = debouncedSearchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const productName =
        productsMap[order.productId]?.name.toLowerCase() ?? "";
      const matchesSearch =
        !normalizedQuery ||
        order.customerName.toLowerCase().includes(normalizedQuery) ||
        productName.includes(normalizedQuery) ||
        String(order.id).includes(normalizedQuery);
      return (
        matchesSearch &&
        (statusFilter === "all" || order.status === statusFilter)
      );
    });
  }, [orders, productsMap, debouncedSearchTerm, statusFilter]);

  function handleStatusChange(id: number, status: Order["status"]) {
    updateOrderStatus(id, status);
    toast.success(`Order #${id} marked as ${status}`);
  }

  function handleDelete(id: number) {
    const order = orders.find((o) => o.id === id);
    deleteOrder(id);
    if (order) toast.success(`Order from ${order.customerName} deleted`);
  }

  if (ordersLoading || productsLoading) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Loading orders...
      </p>
    );
  }

  if (ordersError || productsError) {
    return (
      <p role="alert" className="text-sm text-red-600 dark:text-red-300">
        Unable to load orders. Please refresh and try again.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Fulfillment
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Orders
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track customer orders and shipping progress clearly.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            aria-hidden="true"
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <label htmlFor="order-search" className="sr-only">
            Search orders by ID, customer, or product
          </label>
          <input
            id="order-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search ID, customer, or product..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pr-3.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            aria-hidden="true"
            size={17}
            className="text-slate-400"
          />
          <label htmlFor="order-status-filter" className="sr-only">
            Filter orders by status
          </label>
          <select
            id="order-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <p
          aria-live="polite"
          className="text-sm text-slate-500 dark:text-slate-400 sm:ml-auto"
        >
          {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No orders match your current search.
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          productsMap={productsMap}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default OrdersPage;
