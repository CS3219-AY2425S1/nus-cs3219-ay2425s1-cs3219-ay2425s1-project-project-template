import React from 'react';
import '../../styles/CollabQuestion.css';

const QuestionContainer = ({ question }) => {
    return (
        <div className="question-container" >
            <div className="question-header" >
                <h2>{question.title}</h2>
            </div>

            <div className="question-subheader">
                <h3>Topic(s): {question.topic.join(', ')}</h3>
                <h3>Difficulty: {question.difficulty}</h3>
            </div>

            <div className="question-content">
                <p>{question.description}</p>

                {question.images && question.images.map((image, index) => (
                    <img key={index} src={image} alt={`Question diagram ${index + 1}`} style={{ maxWidth: "100%", margin: "10px 0" }} />
                ))}
                
                {question.leetcode_link && (
                    <a href={question.leetcode_link} target="_blank" rel="noopener noreferrer">
                        View on LeetCode
                    </a>
                )}
            </div>
        </div>
    )
}

export default QuestionContainer;