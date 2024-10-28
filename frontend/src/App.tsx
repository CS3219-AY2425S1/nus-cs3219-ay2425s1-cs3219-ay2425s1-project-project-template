import "./App.css";
import NotFoundPage from "./not-found";
import QuestionPage from "./pages/Question/page";
import LoginPage from "./pages/Login/login";
import SignupPage from "./pages/Signup/signup";
import PrivateRoute from "./routes/PrivateRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { useContext, useEffect } from "react";
import { AuthContext } from "./hooks/AuthContext";
import PublicRoute from "./routes/PublicRoute";
import SettingsPage from "./pages/Settings/settings";

const queryClient = new QueryClient();
const TOAST_LIMIT = 3

function App() {

  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  const { isAuthenticated } = useContext(AuthContext);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center" />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<QuestionPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
