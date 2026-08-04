import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      toast.success("Login successful");
      navigate("/", { replace: true });
    } catch {
      setError("Invalid email or password");
      toast.error("The email or password you entered is incorrect");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.06),transparent_45%),linear-gradient(135deg,#f8fafc_0%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.1),transparent_35%),linear-gradient(135deg,#0f172a_0%,#020617_100%)] px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.8)]"
        aria-describedby={error ? "login-error" : undefined}
      >
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Commerce OS
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage products, orders, and customers.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        <div className="mb-5 flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        {error && (
          <p role="alert" className="mb-5 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Demo credentials: admin@example.com / 123456
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
