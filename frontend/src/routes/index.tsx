import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import EditProfile from "../pages/EditProfile";
import ChangePassword from "../pages/ChangePassword";
import QuestionRepo from "../pages/QuestionRepo";
import QuestionDetails from "../pages/QuestionDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "/questions",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <QuestionRepo />,
      },
      {
        path: ":id",
        element: <QuestionDetails />,
      },
    ],
  },
]);

export default router;
