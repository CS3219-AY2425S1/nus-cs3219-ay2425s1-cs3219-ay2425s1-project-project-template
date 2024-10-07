import "./App.css";
import QuestionPage from "./pages/Question/question";
import NavBar from "./components/NavBar/navbar";
import LoginPage from "./pages/Login/login";
import SignupPage from "./pages/Signup/signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="App">
        <NavBar />
        <header className="App-header">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<QuestionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </BrowserRouter>
        </header>
      </div>
    </QueryClientProvider>
  );
}

export default App;
