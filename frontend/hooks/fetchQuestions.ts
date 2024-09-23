import axios from 'axios';
import { Question } from '../types/Question';

export const fetchQuestions = async () => {
    return await axios.get<Question[]>('http://localhost:8000/api/question')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching questions:', error);
            return [];
        });
};