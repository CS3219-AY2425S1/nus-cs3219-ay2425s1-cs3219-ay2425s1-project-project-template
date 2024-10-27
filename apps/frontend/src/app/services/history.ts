const HISTORY_SERVICE_URL = process.env.NEXT_PUBLIC_HISTORY_SERVICE_URL;

export interface History {
    title: string;
    code: string;
    language: string;
    user: string;
    matchedUser: string;
    matchId: string;
    matchedTopics: string[];
    questionDocRefId: string;
    questionDifficulty: string;
    questionTopics: string[];
    createdAt?: string;
    updatedAt?: string;
    docRefId?: string;
}

export const CreateHistory = async (
    history: History
): Promise<History> => {
    const response = await fetch(`${HISTORY_SERVICE_URL}histories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(history),
    });

    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error(
            `Error creating history: ${response.status} ${response.statusText}`
        );
    }
};

export const UpdateHistory = async (
    history: History,
    historyDocRefId: string
): Promise<History> => {
    const response = await fetch(
        `${HISTORY_SERVICE_URL}histories/${historyDocRefId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(history),
        }
    );

    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error(
            `Error updating history: ${response.status} ${response.statusText}`
        );
    }
}
