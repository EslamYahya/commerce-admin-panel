import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Package },
  { label: "Orders", path: "/orders", icon: ShoppingCart },
  { label: "Users", path: "/users", icon: Users },
];

function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex h-14 items-center border-b border-slate-200 px-4 dark:border-slate-800 md:h-16 md:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Commerce
          </p>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
            Admin Panel
          </span>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex flex-1 gap-1 overflow-x-auto p-2 md:flex-col md:p-4"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all md:gap-3 md:px-4 md:py-2.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              }`
            }
          >
            <item.icon aria-hidden="true" size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
