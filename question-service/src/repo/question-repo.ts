import questionModel from "../model/question-model";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
    let mongoUri = process.env.ENV == "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;
    
    await connect(mongoUri || "");
}

export async function saveQuestion(question: any) {
    return await questionModel.create(question);
}

export async function getQuestions() {
    return await questionModel.find();
}

export async function getQuestionById(id: string) {
    return await questionModel.findById(id);
}

export async function getQuestionByTitle(title: string) {
    return await questionModel.findOne({ title });
}

export async function updateQuestionById(id: string, title: string, description: string, category: string, complexity: string) {
    return await questionModel.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                description,
                category,
                complexity
            },
        },
        { new: true },
    );
}

export async function deleteQuestionById(id: string) {
    return await questionModel.findByIdAndDelete(id);
}
