import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiMenu, FiX, FiPlus, FiFileText,
  FiBookmark, FiStar, FiUser, FiLogOut,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import Logo from "../components/shared/Logo";

const userLinks = [
  { to: "/dashboard/add-prompt", label: "Add Prompt", icon: FiPlus },
  { to: "/dashboard/my-prompts", label: "My Prompts", icon: FiFileText },
  { to: "/dashboard/saved-prompts", label: "Saved Prompts", icon: FiBookmark },
  { to: "/dashboard/my-reviews", label: "My Reviews", icon: FiStar },
  { to: "/dashboard/profile", label: "Profile", icon: FiUser },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
    isActive
      ? "bg-secondary/10 font-semibold text-secondary"
      : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
  }`;

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogOut = () => {
    logOut().then(() => navigate("/"));
  };

  const Sidebar = () => (
    <aside className="flex h-full w-64 flex-col border-r border-base-300 bg-base-200 px-3 py-6">
      <div className="mb-6 px-3">
        <Logo />
      </div>

      {/* User info */}
      <div className="mb-4 flex items-center gap-3 rounded-sm border border-base-300 bg-base-100 px-3 py-3">
        <img
          src={user?.photoURL || "https://i.ibb.co/2kR4R7g/default-avatar.png"}
          alt={user?.displayName}
          referrerPolicy="no-referrer"
          className="h-8 w-8 rounded-full object-cover ring-2 ring-secondary ring-offset-1"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-base-content">
            {user?.displayName}
          </p>
          <p className="truncate font-mono text-[10px] text-base-content/40">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {userLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogOut}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-accent hover:bg-accent/10"
        >
          <FiLogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-base-content/30 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile topbar */}
        <div className="flex h-16 items-center gap-4 border-b border-base-300 bg-base-200 px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-square btn-sm"
          >
            <FiMenu size={20} />
          </button>
          <Logo />
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;