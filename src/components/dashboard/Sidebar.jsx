import { NavLink, useNavigate } from "react-router-dom";
import {
  FiPlus, FiFileText, FiBookmark,
  FiStar, FiUser, FiLogOut, FiBarChart2,
  FiPieChart, FiUsers, FiDollarSign, FiAlertTriangle,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Logo from "../shared/Logo";
import useUserRole from "../../hooks/useUserRole";

const userLinks = [
  { to: "/dashboard/add-prompt", label: "Add Prompt", icon: FiPlus },
  { to: "/dashboard/my-prompts", label: "My Prompts", icon: FiFileText },
  { to: "/dashboard/saved-prompts", label: "Saved Prompts", icon: FiBookmark },
  { to: "/dashboard/my-reviews", label: "My Reviews", icon: FiStar },
  { to: "/dashboard/profile", label: "Profile", icon: FiUser },
];

const creatorLinks = [
  { to: "/dashboard/creator-home", label: "Creator Stats", icon: FiBarChart2 },
];

const adminLinks = [
  { to: "/dashboard/analytics", label: "Analytics", icon: FiPieChart },
  { to: "/dashboard/all-users", label: "All Users", icon: FiUsers },
  { to: "/dashboard/all-prompts", label: "All Prompts", icon: FiFileText },
  { to: "/dashboard/all-payments", label: "All Payments", icon: FiDollarSign },
  { to: "/dashboard/reported-prompts", label: "Reported Prompts", icon: FiAlertTriangle },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
    isActive
      ? "bg-secondary/10 font-semibold text-secondary"
      : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
  }`;

const Sidebar = ({ onClose = () => {} }) => {
  const { user, logOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut().then(() => navigate("/"));
  };

  return (
    <aside
      className="flex w-64 flex-col border-r border-base-300 bg-base-200"
      style={{ height: "100dvh" }}
    >
      {/* Fixed top */}
      <div className="shrink-0 px-3 pt-6 pb-2">
        <div className="mb-4 px-3">
          <Logo />
        </div>
        <div className="flex items-center gap-3 rounded-sm border border-base-300 bg-base-100 px-3 py-3">
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
            {role && role !== "User" && (
              <span className="mt-1 inline-block rounded-full bg-secondary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
                {role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
        {userLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}

        {(role === "Creator" || role === "Admin") && (
          <>
            <p className="mt-5 mb-1 px-3 font-mono text-[9px] uppercase tracking-widest text-base-content/30">
              Creator
            </p>
            {creatorLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </>
        )}

        {role === "Admin" && (
          <>
            <p className="mt-5 mb-1 px-3 font-mono text-[9px] uppercase tracking-widest text-base-content/30">
              Admin
            </p>
            {adminLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Fixed bottom logout */}
      <div className="shrink-0 border-t border-base-300 px-3 py-4">
        <button
          onClick={handleLogOut}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-accent hover:bg-accent/10"
        >
          <FiLogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;