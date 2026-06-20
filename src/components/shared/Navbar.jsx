// src/components/shared/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiGrid,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Logo from "./Logo";

// Label-style nav links: tracked uppercase, thin amber rule under the active item
const navLinkClass = ({ isActive }) =>
  `border-b-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
    isActive
      ? "border-secondary text-base-content"
      : "border-transparent text-base-content/50 hover:text-base-content/80"
  }`;

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogOut = () => {
    logOut().catch((err) => console.error(err));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-10 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/all-prompts" className={navLinkClass}>
            All Prompts
          </NavLink>
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-base-content/70 hover:text-base-content"
              >
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 py-1 pl-1 pr-3 hover:border-secondary"
              >
                <img
                  src={
                    user.photoURL ||
                    "https://i.ibb.co/2kR4R7g/default-avatar.png"
                  }
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-secondary ring-offset-2 ring-offset-base-100"
                />
                <FiChevronDown className="text-base-content/50" size={16} />
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu z-50 mt-3 w-56 border border-base-300 bg-base-200 p-2 shadow-md"
              >
                <li className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                  {user.email}
                </li>
                <li>
                  {/* Replace with role-based redirect once useUserRole is wired up */}
                  <Link to="/dashboard">
                    <FiGrid size={15} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile">
                    <FiUser size={15} /> Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogOut} className="text-accent">
                    <FiLogOut size={15} /> Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="btn btn-ghost btn-square md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-base-300 bg-base-200 md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-5">
              <NavLink
                to="/"
                className={navLinkClass}
                end
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/all-prompts"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                All Prompts
              </NavLink>

              <div className="divider my-1" />

              {!user ? (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm flex-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm flex-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/dashboard"
                    className="btn btn-outline btn-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiGrid size={15} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogOut}
                    className="btn btn-outline btn-sm text-accent"
                  >
                    <FiLogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;