import { saveQuestion, getQuestions, getQuestionById, updateQuestionById, deleteQuestionById, getQuestionByTitle } from '../repo/question-repo';

export async function createQuestion(questionData: any) {
    if (!questionData.title || !questionData.description) {
        throw new Error("Title and description are required");
    }
    return await saveQuestion(questionData);
}

export async function fetchAllQuestions() {
    return await getQuestions();
}

export async function fetchQuestionById(id: string) {
    const question = await getQuestionById(id);
    if (!question) {
        throw new Error(`Question with ID: ${id} not found`);
    }
    return question;
}

export async function fetchQuestionByTitle(title: string) {
    const question = await getQuestionByTitle(title);
    if (!question) {
        throw new Error(`Question with title: ${title} not found`);
    }
    return question;
}

export async function modifyQuestionById(id: string, updateData: any) {
    const { title, description, category, complexity } = updateData;

    if (!title || !description) {
        throw new Error("Title and description are required to update a question");
    }

    const updatedQuestion = await updateQuestionById(id, title, description, category, complexity);
    if (!updatedQuestion) {
        throw new Error(`Question with ID: ${id} not found`);
    }

    return updatedQuestion;
}

export async function removeQuestionById(id: string) {
    const deletedQuestion = await deleteQuestionById(id);
    if (!deletedQuestion) {
        throw new Error(`Question with ID: ${id} not found or already deleted`);
    }
    return true;
}
