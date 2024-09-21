import React from 'react';
import './QuestionPage.css'; // Make sure this file contains your styles

function NewPage() {
  return (
    <div className="question-page-container">
      <div className="form-section">
        <div className="row">
          <label htmlFor="difficulty">Difficulty:</label>
          <select id="difficulty" className="dropdown">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label htmlFor="topic">Topic:</label>
          <select id="topic" className="dropdown">
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="programming">Programming</option>
          </select>
        </div>

        <div className="hints-section">
          <label htmlFor="hints">Hints:</label>
          <textarea id="hints" className="textarea"></textarea>
        </div>

        <div className="constraints-section">
          <label htmlFor="constraints">Constraints:</label>
          <input type="text" id="constraints" className="input-field" />
        </div>

        {/* Scrollable Selection Menu */}
        <div className="scrollable-menu">
          <label className="label">Items:</label>
          <ul className="menu-list">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
            <li>Item 5</li>
            <li>Item 6</li>
            <li>Item 7</li>
            <li>Item 8</li>
          </ul>
        </div>
      </div>

      <div class="left-section">
        <div className="question-section">
          <label htmlFor="question">Question:</label>
          <textarea id="question" className="textarea"></textarea>
        </div>

        <div className="button-section">
          <button className="set-question-button">Set Question</button>
        </div>
      </div>
    </div>
  );
}

export default NewPage;
