import useAuth from "../../hooks/useAuth";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Welcome to your dashboard
      </h1>
      <p className="mt-2 text-base-content/60">Logged in as {user?.email}</p>
      <p className="mt-1 text-sm text-base-content/40">
        Real dashboard routes (Add Prompt, My Prompts, Profile...) come in
        later milestones.
      </p>
    </div>
  );
};

export default DashboardHome;