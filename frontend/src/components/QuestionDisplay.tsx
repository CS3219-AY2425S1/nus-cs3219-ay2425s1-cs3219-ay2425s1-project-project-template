import React, { useEffect, useState } from 'react';

const QuestionDisplay: React.FC = () => {
    const [question, setQuestion] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https:localhost:8080/questions');
                setQuestion(response.data);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Question:</h1>
            <p>{question}</p>
        </div>
    );
};

export default QuestionDisplay;