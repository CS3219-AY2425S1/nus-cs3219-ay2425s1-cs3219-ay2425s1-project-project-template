import logo from '.././styles/logo.svg';
import '.././styles/App.css';
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      
      <Navbar />
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is a temporary home page for Milestone 2, just click on the "Questions" option above.
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
  );
}

export default Home;