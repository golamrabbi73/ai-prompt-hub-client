// src/pages/Dashboard/DashboardHome.jsx
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const DashboardHome = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
        {role || "User"} Dashboard
      </span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-base-content">
        Welcome back, {user?.displayName?.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-base-content/60">
        Logged in as {user?.email}
      </p>
      <p className="mt-1 text-sm text-base-content/40">
        {role === "Admin"
          ? "Admin tools (user management, prompt moderation) coming in a later milestone."
          : role === "Creator"
          ? "Creator analytics and tools coming in a later milestone."
          : "Use the sidebar to add prompts, manage saved items, and view your reviews."}
      </p>
    </div>
  );
};

export default DashboardHome;