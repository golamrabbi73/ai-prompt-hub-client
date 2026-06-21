import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* Footer goes here in a later milestone */}
    </div>
  );
};

export default MainLayout;