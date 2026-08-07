import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 dark:bg-slate-950">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
        404
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        Page not found
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
