// src/pages/Dashboard/DashboardHome.jsx

import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiFileText,
  FiBookmark,
  FiStar,
  FiUser,
  FiUsers,
  FiPieChart,
  FiAlertTriangle,
  FiDollarSign,
  FiBarChart2,
  FiArrowRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const userQuickLinks = [
  {
    to: "/dashboard/add-prompt",
    label: "Add Prompt",
    icon: FiPlus,
    desc: "Submit a new prompt",
  },
  {
    to: "/dashboard/my-prompts",
    label: "My Prompts",
    icon: FiFileText,
    desc: "Manage your prompts",
  },
  {
    to: "/dashboard/saved-prompts",
    label: "Saved Prompts",
    icon: FiBookmark,
    desc: "View bookmarks",
  },
  {
    to: "/dashboard/my-reviews",
    label: "My Reviews",
    icon: FiStar,
    desc: "Your submitted reviews",
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: FiUser,
    desc: "View your profile",
  },
];

const creatorQuickLinks = [
  {
    to: "/dashboard/creator-home",
    label: "Creator Stats",
    icon: FiBarChart2,
    desc: "Your prompt analytics",
  },
];

const adminQuickLinks = [
  {
    to: "/dashboard/analytics",
    label: "Analytics",
    icon: FiPieChart,
    desc: "Site-wide stats",
  },
  {
    to: "/dashboard/all-users",
    label: "All Users",
    icon: FiUsers,
    desc: "Manage users",
  },
  {
    to: "/dashboard/all-prompts",
    label: "All Prompts",
    icon: FiFileText,
    desc: "Approve or reject",
  },
  {
    to: "/dashboard/all-payments",
    label: "All Payments",
    icon: FiDollarSign,
    desc: "Revenue history",
  },
  {
    to: "/dashboard/reported-prompts",
    label: "Reported Prompts",
    icon: FiAlertTriangle,
    desc: "Handle reports",
  },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();
  const navigate = useNavigate();

  if (roleLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  const links = [
    ...userQuickLinks,
    ...(role === "Creator" || role === "Admin" ? creatorQuickLinks : []),
    ...(role === "Admin" ? adminQuickLinks : []),
  ];

  return (
    <div className="px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
          {role || "User"} Dashboard
        </span>

        <h1 className="mt-2 font-display text-2xl font-semibold text-base-content">
          Welcome back, {user?.displayName?.split(" ")[0]} 👋
        </h1>

        <p className="mt-1 text-sm text-base-content/50">
          {user?.email}
        </p>

        <p className="mt-2 max-w-2xl text-sm text-base-content/45">
          Manage your prompts, saved items, reviews, and account from one place.
        </p>
      </motion.div>

      {/* Quick Access */}
      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-base-content/30">
          Quick Access
        </p>

        <p className="mt-1 text-xs text-base-content/40">
          Frequently used actions
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {links.map(({ to, label, icon: Icon, desc }, i) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: i * 0.06,
              }}
              className="
                group
                flex
                cursor-pointer
                items-center
                gap-4
                border
                border-base-300
                bg-base-200
                p-4
                text-left
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-secondary/50
                hover:bg-secondary/5
                hover:shadow-lg
                active:scale-[0.98]
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  border
                  border-base-300
                  bg-base-100
                  text-secondary
                  transition-all
                  duration-200
                  group-hover:scale-110
                  group-hover:border-secondary
                "
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-base-content">
                  {label}
                </p>

                <p className="mt-0.5 font-mono text-[10px] text-base-content/40">
                  {desc}
                </p>
              </div>

              <div
                className="
                  opacity-0
                  transition-all
                  duration-200
                  group-hover:translate-x-1
                  group-hover:opacity-100
                "
              >
                <FiArrowRight
                  size={18}
                  className="text-secondary"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;