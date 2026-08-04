import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import type { Order } from "../types";
import type { Product } from "@/features/products/types";

interface OrdersTableProps {
  orders: Order[];
  productsMap: Record<number, Product>;
}

type SortKey = "customerName" | "totalPrice" | "orderDate" | "status";
const PAGE_SIZE = 5;

function OrdersTable({ orders, productsMap }: OrdersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("orderDate");
  const [ascending, setAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sortedOrders = useMemo(() => [...orders].sort((first, second) => {
    const result = typeof first[sortKey] === "number"
      ? Number(first[sortKey]) - Number(second[sortKey])
      : String(first[sortKey]).localeCompare(String(second[sortKey]));
    return ascending ? result : -result;
  }), [ascending, orders, sortKey]);
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleOrders = sortedOrders.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  function sortBy(key: SortKey) {
    setCurrentPage(1);
    if (key === sortKey) setAscending((value) => !value);
    else { setSortKey(key); setAscending(true); }
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-190 w-full text-left text-sm">
        <caption className="sr-only">Orders</caption>
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <tr>
            <th scope="col" aria-sort={sortKey === "customerName" ? (ascending ? "ascending" : "descending") : "none"} className="px-4 py-3 font-semibold"><button type="button" onClick={() => sortBy("customerName")} className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">Customer <ArrowUpDown aria-hidden="true" size={14} /></button></th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Product
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Quantity
            </th>
            <th scope="col" aria-sort={sortKey === "totalPrice" ? (ascending ? "ascending" : "descending") : "none"} className="px-4 py-3 font-semibold"><button type="button" onClick={() => sortBy("totalPrice")} className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">Total <ArrowUpDown aria-hidden="true" size={14} /></button></th>
            <th scope="col" aria-sort={sortKey === "orderDate" ? (ascending ? "ascending" : "descending") : "none"} className="px-4 py-3 font-semibold"><button type="button" onClick={() => sortBy("orderDate")} className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">Order date <ArrowUpDown aria-hidden="true" size={14} /></button></th>
            <th scope="col" aria-sort={sortKey === "status" ? (ascending ? "ascending" : "descending") : "none"} className="px-4 py-3 font-semibold"><button type="button" onClick={() => sortBy("status")} className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">Status <ArrowUpDown aria-hidden="true" size={14} /></button></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleOrders.map((order) => (
            <tr
              key={order.id}
              className="text-slate-700 transition-colors hover:bg-slate-50/80 dark:text-slate-200 dark:hover:bg-slate-900/70"
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                {order.customerName}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                {productsMap[order.productId]?.name ?? "Unknown Product"}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                {order.quantity}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                ${order.totalPrice.toFixed(2)}
              </td>
              <td className="px-4 py-3 dark:text-slate-200">
                {new Date(order.orderDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    order.status === "delivered"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-200/15 dark:text-emerald-200"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-200/15 dark:text-red-200"
                        : order.status === "shipped"
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-200/15 dark:text-sky-200"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-200/15 dark:text-amber-200"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={safeCurrentPage} pageSize={PAGE_SIZE} totalItems={sortedOrders.length} onPageChange={setCurrentPage} />
    </div>
  );
}

export default OrdersTable;
