import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import logo from '.././styles/logo.svg';
import '.././styles/App.css';
import GeneralNavbar from "../components/GeneralNavbar";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      try {
        const response = await axios.get(
          "http://localhost:3001/auth/verify-token",
          { 
            headers: {
              Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
          }
        );
        if (response.status === 200) {
          const { message, data } = response.data;
          const user = data.username;
          setUsername(user);
        } else {
          console.error(response.data.message);
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };
  return (
    <>
      <div className="home_page">
        <GeneralNavbar />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;