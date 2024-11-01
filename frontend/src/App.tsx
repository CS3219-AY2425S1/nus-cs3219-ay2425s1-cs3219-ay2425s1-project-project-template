import NotFoundPage from "./not-found";
import LoginPage from "./pages/Login/login";
import SignupPage from "./pages/Signup/signup";
import PrivateRoute from "./routes/PrivateRoute";
import NavBar from "./components/NavBar/navbar";
import QuestionPage from "./pages/Question/page";
import HistoryPage from "./pages/History/history";

import { BrowserRouter, Navigate, redirect, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./hooks/AuthContext";
import PublicRoute from "./routes/PublicRoute";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center"/>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route element={<PublicRoute/>}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            <Route element={<PrivateRoute/>}>
              <Route path="/" element= {<><NavBar /><QuestionPage /></>} />
              <Route path="/history" element= {<><NavBar /><HistoryPage /></>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
