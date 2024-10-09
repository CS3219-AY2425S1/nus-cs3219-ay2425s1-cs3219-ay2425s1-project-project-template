import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthNavBar from "../components/AuthNavBar.tsx";
import WelcomeMessage from "../components/User/WelcomeMessage.tsx";
import InputBoxLabel from "../components/User/InputBoxLabel.tsx";
import InputTextBox from "../components/User/InputTextBox.tsx";

const LoginPage: React.FC = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <div className="w-screen h-screen flex flex-col">
      <AuthNavBar />
      <div className="flex flex-col items-center justify-start flex-grow">
        <WelcomeMessage />
        
        <div className="mt-10 w-2/5 justify-start">
            {/* Email or username */}
            <div className="flex flex-col">
            <InputBoxLabel labelString="Email" />
            <InputTextBox currInput={""} setInputValue={setEmailValue} />
            </div>

            {/* Email or username */}
            <div className="flex flex-col mt-5">
            <InputBoxLabel labelString="Password" />
            <InputTextBox currInput={""} setInputValue={setPasswordValue} />
            </div>
        </div>
        
        <Link to="/dashboardForUsers">
          <button className="mt-2 py-2 text-gray-700 hover:opacity-60">
            Forget Password?
          </button>
        </Link>

        <Link to="/dashboardForUsers">
          <button className="bg-yellow rounded-[25px] py-1.5 px-10 mt-4 text-off-white hover:opacity-60">
            Login
          </button>
        </Link>

        <div className="flex flex-row w-2/5 mt-3">
            <p className="text-gray-600">Don't have an account?</p>
            <Link to="/register">
            <button className="mx-1 text-blue-600 hover:opacity-60">
                Register Instead
            </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
