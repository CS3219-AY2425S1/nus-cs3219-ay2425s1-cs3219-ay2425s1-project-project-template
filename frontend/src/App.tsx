import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePageView from "./views/HomePageView";
import LoginPage from "./views/LoginPageView";
import QuestionPageView from "./views/QuestionPageView";
import CreateAccountPageView from "./views/CreateAccountPageView";
import CollabPageView from "./views/CollabPageView";
import DeleteAccountPage from "./views/DeleteAccountPageView";
import ProtectedRoute from "@/components/custom/ProtectedRoute/ProtectedRoute"; 

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/questions" 
          element={
            <ProtectedRoute>
              <QuestionPageView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-account" 
          element={<CreateAccountPageView />} 
        />
        <Route 
          path="/collab" 
          element={
            <ProtectedRoute>
              <CollabPageView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delete-account" 
          element={
            <ProtectedRoute>
              <DeleteAccountPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<p>404: Page Not Found!</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
