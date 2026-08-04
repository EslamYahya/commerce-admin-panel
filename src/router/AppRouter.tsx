import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function AppRouter() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
          Loading page...
        </p>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default AppRouter;
