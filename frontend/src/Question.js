import "./question.css";
import { useState } from "react";

// This should be dynamic routing and go by question ID
function Question() {

  const [descriptionText, setDescriptionText] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex \
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat \
nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex \
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat \
nulla pariatur.");

  const [editMode, setEditMode] = useState(false);
  const changeEditMode = (e) => {
    setEditMode(prevState => !prevState);
  }

  const changeDescriptionText = (e) => {
    setDescriptionText(e.target.value);
  }

  return(
    <div className="question">
      <div className="row1">
        <div className="category-display">
          Category
        </div>
        <div className="complexity-display">
          Complexity
        </div>
      </div>
      <div className="row2">
        <div className="question-title">
          Topic: Reverse a Linked List
        </div>
      </div>
      <div className="row3">
        <textarea className="description-component" type="text" value={descriptionText} disabled={!editMode}
          spellCheck={false} onChange={changeDescriptionText}>
        </textarea>
      </div>
      <div className="row4">
        <button className="edit-button" onClick={changeEditMode}>{editMode ? "Save" : "Edit"}</button>
        <button className="delete-button">Delete</button>
      </div>
    </div>
  );
}

export default Question;