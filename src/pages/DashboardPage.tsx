import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CircleAlert, Package, ShoppingCart, WalletCards } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useOrders } from "@/features/orders/hooks/useOrders";
import StatCard from "@/components/ui/Statcard";

const LOW_STOCK_THRESHOLD = 20;

function DashboardPage() {
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
  } = useOrders();

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalPrice, 0),
    [orders],
  );

  const lowStockCount = useMemo(
    () =>
      products.filter((product) => product.stock < LOW_STOCK_THRESHOLD).length,
    [products],
  );

  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [orders],
  );

  const chartData = useMemo(
    () =>
      Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      })),
    [statusCounts],
  );

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock < LOW_STOCK_THRESHOLD).slice(0, 4),
    [products],
  );

  if (productsLoading || ordersLoading) {
    return <div aria-busy="true" aria-label="Loading dashboard" className="space-y-6"><div className="h-28 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />)}</div><div className="h-80 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" /></div>;
  }

  if (productsError || ordersError) {
    return (
      <div
        className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm dark:border-red-700 dark:bg-red-950/40 dark:text-red-200"
        role="alert"
      >
        Unable to load dashboard data. Please refresh and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Overview
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Overview
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A focused snapshot of your catalog and order health.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={String(products.length)}
          icon={Package}
        />
        <StatCard
          label="Total Orders"
          value={String(orders.length)}
          icon={ShoppingCart}
        />
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={WalletCards}
        />
        <StatCard
          label="Low Stock Products"
          value={String(lowStockCount)}
          icon={CircleAlert}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.85fr)]">
      <section
        aria-labelledby="orders-by-status"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3
              id="orders-by-status"
              className="text-lg font-semibold text-slate-900"
            >
              Orders by Status
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monitor fulfillment performance at a glance.
            </p>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-70 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            No order data available yet.
          </div>
        )}
      </section>
      <section aria-labelledby="inventory-health" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="inventory-health" className="text-lg font-semibold text-slate-900 dark:text-slate-100">Inventory health</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Products below {LOW_STOCK_THRESHOLD} units.</p>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-200/15 dark:text-amber-200">{lowStockCount} attention</span>
        </div>
        {lowStockProducts.length ? <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">{lowStockProducts.map((product) => <li key={product.id} className="flex items-center justify-between gap-3 py-3"><span className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-200">{product.name}</span><span className="shrink-0 text-sm font-semibold text-amber-700 dark:text-amber-300">{product.stock} left</span></li>)}</ul> : <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">All catalog items are comfortably stocked.</p>}
        <Link to="/products" className="mt-5 inline-flex text-sm font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100">Review inventory <span aria-hidden="true" className="ml-1">→</span></Link>
      </section>
      </div>
    </div>
  );
}

export default DashboardPage;
