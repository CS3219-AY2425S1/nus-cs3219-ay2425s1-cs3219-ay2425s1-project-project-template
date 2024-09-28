import "../styles/question.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// This should be dynamic routing and go by question ID
export const Question = () => {

  const QUESTIONS_SERVICE_HOST = "http://localhost:3001";
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");
  const [title, setTitle] = useState("");
  const [descriptionText, setDescriptionText] = useState("");

  const [createMode, setCreateMode] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);

  const changeEditMode = (e) => {
    setHasEdited(false);
    setEditMode(prevState => !prevState);
  }

  const changeTitleText = (e) => {
    setHasEdited(true);
    setTitle(e.target.value);
  }

  const changeDescriptionText = (e) => {
    setHasEdited(true);
    setDescriptionText(e.target.value);
  }

  const splitCategory = (categories) => {
    var output = "";
    for (const category of categories) {
      output += category + ", ";
    }
    // Removes the last comma
    return output.substring(0, output.length - 2);
  }

  const getQuestionData = async (id) => {
    try {
      const response = await axios.get(`${QUESTIONS_SERVICE_HOST}/questions/${id}`);
      if (response.status === 404 || response.status === 500) {
        //404 not found
        navigate('/*')
      }
      console.log(response.data);
      setCategory(splitCategory(response.data.category));
      setComplexity(response.data.complexity);
      setTitle(response.data.title);
      setDescriptionText(response.data.description);
    } catch (error) {
      navigate('/*');
    }
  }

  const params = useParams();
  useEffect(() => {
    if (params.id === "new") {
      //new question
      setEditMode(true);
      setCreateMode(true);
    } else {
      getQuestionData(params.id);
    }
  }, [params])

  return(
    <div className="question">
      <div className="row1">
        <div className="complexity-display">
          {complexity}
        </div>
        <div className="category-display">
          {category}
        </div>
      </div>
      <div className="row2">
        <textarea className="question-title" type="text" value={title} disabled={!editMode} 
          spellCheck={false} onChange={changeTitleText}>
        </textarea>
      </div>
      <div className="row3">
        <textarea className="description-component" type="text" value={descriptionText} disabled={!editMode}
          spellCheck={false} onChange={changeDescriptionText}>
        </textarea>
      </div>
      <div className="row4">
        {createMode ? <button className="edit-button">Create</button> : <button className="edit-button" onClick={changeEditMode}>{editMode ? (hasEdited ? "Save" : "Cancel") : "Edit"}</button>}
        {hasEdited ? <button className="edit-button">Cancel</button> : null}
      </div>
    </div>
  );
}

