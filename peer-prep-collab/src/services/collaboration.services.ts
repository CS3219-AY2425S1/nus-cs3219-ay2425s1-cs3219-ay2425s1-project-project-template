import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {config} from '../config/config';
import {Question} from '../models/question.model';
import {Session} from '../models/session.model';

// in-memory session storage, to integrate with Redis later on
const activeSessions: Record<string, Session> = {};

export const createCollaborationService = async (
    difficulty: string,
    category: string,
    sessionId: string,
): Promise<Session | null> => {
    try {
        // fetch questions based on difficulty and category from questions service 
        const question = await getQuestion(difficulty, category);
        if (!question) {
            console.error('No questions found for the given difficulty and category');
            return null;
        }

        // alternative: generate unique session ID within collab svc - not sure if that'll work
        // const newSessionId = uuidv4();

        const session : Session = {
            sessionId,
            users: [],
            question,
        };

        activeSessions[sessionId] = session;
        return session;
    } catch (error) {
        console.error('Error creating collaboration service', error);
        return null;
    }
}

export const getQuestion = async (
    difficulty: string,
    category: string
): Promise<Question | null> => {
    try {
        // fetch questions based on difficulty and category from questions service 
        const response = await axios.get(`${config.questionsServiceUrl}/questions/`, {
            params: {
                filterBy: 'question_categories',
                filterValue: category,
            }
        });

        const preDifficultyQuestions = response.data as Question[];

        const validQuestions = preDifficultyQuestions.filter((question: Question) => 
            question.questionComplexity === difficulty
        );

        // pick a random question from the filtered list 
        if (validQuestions.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * validQuestions.length);
        return validQuestions[randomIndex];
    } catch (error) {
        console.error('Error fetching question', error);
        return null;
    }
}

export const getSessionData = async (sessionId: string): Promise<Session | null> => {
    try {
        return activeSessions[sessionId];
    } catch (error) {
        console.error('Error fetching session data', error);
        return null;
    }
}