import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  const iconClasses =
    tone === "warning"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-200/15 dark:text-amber-200"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/40">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <span className={`inline-flex rounded-xl p-2 ${iconClasses}`}>
          <Icon aria-hidden="true" size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
