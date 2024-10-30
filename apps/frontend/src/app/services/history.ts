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
}

export const CreateOrUpdateHistory = async (
    history: History,
    matchId: string,
): Promise<History> => {
    const response = await fetch(
        `${HISTORY_SERVICE_URL}histories/${matchId}`,
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
            `Error saving history: ${response.status} ${response.statusText}`
        );
    }
}

export const GetHistory = async (
    matchId: string,
): Promise<History> => {
    const response = await fetch(
        `${HISTORY_SERVICE_URL}histories/${matchId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error(
            `Error reading history: ${response.status} ${response.statusText}`
        );
    }
}

export const GetUserHistories = async (
    username: string,
): Promise<History[]> => {
    const response = await fetch(
        `${HISTORY_SERVICE_URL}histories/${username}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error(
            `Error reading user histories: ${response.status} ${response.statusText}`
        );
    }
}
