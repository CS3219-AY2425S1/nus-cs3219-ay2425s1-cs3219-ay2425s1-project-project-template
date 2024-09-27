import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import "./App.css";
import QuestionPage from "./pages/Question";
import QuestionDetails from "../components/question/QuestionDetails";
import HomeNavBar from "../components/HomeNavBar";
import Login from "./pages/SignIn/login";

function App() {
  return (
    <Box className="app" fontFamily="Poppins, sans-serif">
      <HomeNavBar />
      <Box pt="80px">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
