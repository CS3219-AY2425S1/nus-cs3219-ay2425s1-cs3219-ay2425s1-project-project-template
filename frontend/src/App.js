import { Route, Routes } from "react-router-dom";
import './styles/App.css';
import { Home, Login, Profile, Questions, Signup, SignupOTP, ForgotPassword, ForgotPasswordOTP } from './pages';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/otp" element={<SignupOTP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;
