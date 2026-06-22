// src/routes/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import PrivateRoute from "./PrivateRoute";
import AllPrompts from "../pages/AllPrompts/AllPrompts";
import PromptDetails from "../pages/PromptDetails/PromptDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "all-prompts", element: <AllPrompts /> },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },
      {
        path: "prompts/:id",
        element: (
          <PrivateRoute>
            <PromptDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;