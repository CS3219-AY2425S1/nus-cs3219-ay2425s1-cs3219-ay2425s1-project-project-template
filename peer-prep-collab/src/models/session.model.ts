import {Question} from './question.model';

export interface Session {
    sessionId: string;
    users: {username1 : string, username2: string};
    question: Question;
}