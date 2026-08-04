import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTheme } from "@/context/useTheme";

function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle =
    location.pathname === "/products"
      ? "Products"
      : location.pathname === "/orders"
        ? "Orders"
        : location.pathname === "/users"
          ? "Users"
          : "Dashboard";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900/80 sm:px-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
          Operations
        </p>
        <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
        >
          {theme === "dark" ? (
            <Sun aria-hidden="true" size={16} strokeWidth={2} />
          ) : (
            <Moon aria-hidden="true" size={16} strokeWidth={2} />
          )}
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {user?.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
        >
          <LogOut aria-hidden="true" size={16} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
