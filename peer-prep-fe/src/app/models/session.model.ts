import {Question} from './question.model';

export interface Session {
    sessionId: string;
    users: {id : string}[];
    question: Question;
}