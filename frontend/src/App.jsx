import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import QuestionTable from './components/QuestionTable';
import LoginPage from './views/login-page/LoginPage';
import MainPage from './views/main-page/MainPage';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />}>
              <Route index element={<QuestionTable />} /> 
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

