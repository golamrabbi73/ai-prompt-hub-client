// src/pages/ErrorPage/ErrorPage.jsx
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-100 px-4 text-center">
      <h1 className="font-display text-4xl text-base-content">
        Something went wrong
      </h1>
      <p className="text-base-content/60">
        {error?.statusText || error?.message || "Page not found."}
      </p>
      <Link to="/" className="btn btn-primary btn-sm">
        Back to home
      </Link>
    </div>
  );
};

export default ErrorPage;