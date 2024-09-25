import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import "./App.css";
import QuestionPage from "./pages/Question";
import QuestionDetails from "../components/question/QuestionDetails";
import HomeNavBar from "../components/HomeNavBar";

function App() {
  return (
    <Box className="app" fontFamily="Poppins, sans-serif">
      <HomeNavBar />
      <Box pt="80px">
        {" "}
        {/* Add padding to the top to account for the fixed navbar */}
        <Routes>
          <Route path="/" element={<QuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
