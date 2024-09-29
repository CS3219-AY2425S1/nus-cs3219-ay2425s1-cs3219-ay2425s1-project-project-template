import QuestionNavbar from "../components/QuestionNavbar";
import QuestionTable from '../components/QuestionTable'
import AddQuestionButton from '../components/AddQuestionButtons'
import '../styles/questions.css';

const Questions = () => {
    return (
        <div>
            <QuestionNavbar />
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