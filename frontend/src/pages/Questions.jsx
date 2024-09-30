import GeneralNavbar from "../components/GeneralNavbar";
import QuestionTable from '../components/QuestionTable'
import AddQuestionButton from '../components/AddQuestionButtons'
import '../styles/questions.css';
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import 'react-toastify/dist/ReactToastify.css';

const Questions = () => {
    
  const navigate = useNavigate();
  const { username, removeCookie } = useAuth();

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
  
    return (
        <div>
            <GeneralNavbar />
            <h1>Questions</h1>
            <p className="description">View all the questions stored in database.</p>
            <div className="question-table-container">
                <div className="admin-button">
                    <AddQuestionButton/>
                </div>
                <QuestionTable />
            </div>
        </div>
    );
}

export default Questions;