import Navbar from "../components/Navbar";
import QuestionTable from '../components/QuestionTable'
import AddQuestionButton from '../components/AddQuestionButtons'
import '../styles/questions.css';

const Questions = () => {
    return (
        <div>
            <Navbar />
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