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
import DashboardLayout from "../layouts/DashboardLayout";
import AddPrompt from "../pages/Dashboard/User/AddPrompt";
import MyPrompts from "../pages/Dashboard/User/MyPrompts";
import UpdatePrompt from "../pages/Dashboard/User/UpdatePrompt";

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
        path: "prompts/:id",
        element: (
          <PrivateRoute>
            <PromptDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "add-prompt", element: <AddPrompt /> },
      { path: "my-prompts", element: <MyPrompts /> },
      { path: "update-prompt/:id", element: <UpdatePrompt /> },
    ],
  },
]);

export default router;