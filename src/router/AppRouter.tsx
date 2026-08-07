import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

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
      { path: "categories", element: <CategoriesPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
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
