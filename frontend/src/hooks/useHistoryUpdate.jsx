import { useState } from "react";

const useHistoryUpdate = () => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);

    const handleHistoryUpdate = async (userId, questionId, language, codeSnippet) => {
        setLoading(true);
        setError(false);
        const historyEntry = {
            questionId: questionId,
            language: language,
            codeSnippet: codeSnippet,
        };
        try {
            const response = await fetch(`http://localhost:3001/users/${userId}/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    historyEntry
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                setLoading(false);
                setError(true);
                throw new Error(errorData.message || 'Failed to update history');
            }
            const data = await response.json();
            console.log(data);
            console.log(`successfully updated history. Data: ${historyEntry}`);
        } catch (error) {
            setLoading(false);
            setError(true)
            console.log(error);
            alert(error);
        }
    }

    return {
        handleHistoryUpdate,
        isLoading,
        isError,
    };
}

export default useHistoryUpdate;