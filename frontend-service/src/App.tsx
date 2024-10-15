import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import "./App.css";
import QuestionPage from "./pages/QuestionPage";
import QuestionDetails from "../components/question/QuestionDetails";
import HomeNavBar from "../components/HomeNavBar";
import Login from "./pages/SignIn/login";
import Home from "./home";
import Signup from "./pages/SignUp/signup";
import MockMatch from "./pages/MockMatch/mockMatch";
import MatchingPage from "./pages/MatchingPage";

function App() {
  return (
    <Box className="app" fontFamily="Poppins, sans-serif">
      <HomeNavBar />
      <Box pt="80px">
        <Routes>
          <Route path="/" element={<QuestionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/mock-match" element={<MockMatch />} />
          <Route path="/match-me" element={<MatchingPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
