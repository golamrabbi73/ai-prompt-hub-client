// src/pages/Dashboard/User/Profile.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiMail, FiCalendar, FiAward, FiFileText, FiShield } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: myPrompts = [], isLoading: promptsLoading } = useQuery({
    queryKey: ["myPrompts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/prompts/user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isPremium = dbUser?.subscription === "premium";
  const approvedCount = myPrompts.filter((p) => p.status === "approved").length;
  const totalCopies = myPrompts.reduce((sum, p) => sum + (p.copyCount || 0), 0);

  if (userLoading || promptsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-base-content">
        My Profile
      </h1>

      {/* Profile card */}
      <div className="mt-6 flex flex-wrap items-center gap-5 border border-base-300 bg-base-200 p-6">
        <img
          src={user?.photoURL || "https://i.ibb.co/2kR4R7g/default-avatar.png"}
          alt={user?.displayName}
          referrerPolicy="no-referrer"
          className="h-20 w-20 rounded-full object-cover ring-2 ring-secondary ring-offset-2"
        />
        <div>
          <h2 className="font-display text-lg font-semibold text-base-content">
            {user?.displayName}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/60">
            <FiMail size={13} /> {user?.email}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-base-content/40">
            <FiCalendar size={12} />
            Joined{" "}
            {dbUser?.createdAt
              ? new Date(dbUser.createdAt).toLocaleDateString()
              : "—"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-base-content/40">
            <FiShield size={12} />
            Role:{" "}
            <span className="font-semibold text-secondary">
              {dbUser?.role || "User"}
            </span>
          </p>
        </div>
      </div>

      {/* Subscription status */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-base-300 bg-base-200 p-6">
        <div className="flex items-center gap-3">
          <FiAward
            size={22}
            className={isPremium ? "text-secondary" : "text-base-content/30"}
          />
          <div>
            <p className="font-display font-semibold text-base-content">
              {isPremium ? "Premium Member" : "Free Plan"}
            </p>
            <p className="text-xs text-base-content/50">
              {isPremium
                ? "You have access to all premium prompts."
                : "Upgrade to unlock private/premium prompts."}
            </p>
          </div>
        </div>

        {!isPremium && (
          <Link to="/payment" className="btn btn-primary btn-sm">
            Upgrade — $5
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="border border-base-300 bg-base-200 p-4 text-center">
          <p className="font-display text-2xl font-semibold text-base-content">
            {myPrompts.length}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
            <FiFileText size={11} /> Submitted
          </p>
        </div>
        <div className="border border-base-300 bg-base-200 p-4 text-center">
          <p className="font-display text-2xl font-semibold text-base-content">
            {approvedCount}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
            Approved
          </p>
        </div>
        <div className="border border-base-300 bg-base-200 p-4 text-center">
          <p className="font-display text-2xl font-semibold text-base-content">
            {totalCopies}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-base-content/40">
            Total Copies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;