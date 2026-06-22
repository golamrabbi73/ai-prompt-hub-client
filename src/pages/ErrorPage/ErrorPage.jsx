// src/pages/ErrorPage/ErrorPage.jsx
import { Link, useRouteError } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-base-100 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
          Error {error?.status || "404"}
        </span>

        <h1 className="font-display text-5xl font-semibold text-base-content">
          {error?.status === 404 ? "Page not found" : "Something went wrong"}
        </h1>

        <p className="max-w-sm text-base-content/50">
          {error?.statusText ||
            error?.message ||
            "The page you're looking for doesn't exist or has been moved."}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <Link to="/" className="btn btn-primary btn-sm">
            Back to home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline border-base-300 btn-sm"
          >
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;