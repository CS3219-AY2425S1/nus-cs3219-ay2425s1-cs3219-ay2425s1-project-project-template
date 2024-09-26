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
        <Routes>
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
        </Routes>
      </Box>
    </Box>
  );
}

>>>>>>> 17a140bf8978a553a0a44aac1e67a80c7aa83add
export default App;
