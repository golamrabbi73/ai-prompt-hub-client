// src/routes/CreatorRoute.jsx
import { Navigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";

const CreatorRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  if (role === "Creator" || role === "Admin") return children;

  return <Navigate to="/dashboard" replace />;
};

export default CreatorRoute;