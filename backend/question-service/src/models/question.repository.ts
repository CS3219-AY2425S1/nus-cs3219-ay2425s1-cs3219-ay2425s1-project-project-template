import { Model, model } from 'mongoose'

import { CreateQuestionDto } from '../types/CreateQuestionDto'
import { IQuestion } from '../types/IQuestion'
import questionSchema from './question.model'

const questionModel: Model<IQuestion> = model('Question', questionSchema)

export async function findAllQuestions(): Promise<IQuestion[]> {
    return questionModel.find()
}

export async function findOneQuestionById(id: string): Promise<IQuestion | null> {
    return questionModel.findById(id)
}

export async function findOneQuestionByTitle(title: string): Promise<IQuestion | null> {
    return questionModel.findOne({ title })
}

export async function findPaginatedQuestions(page: number, limit: number): Promise<IQuestion[]> {
    return questionModel
        .find()
        .limit(limit)
        .skip((page - 1) * limit)
}

export async function findQuestionCount(): Promise<number> {
    return questionModel.countDocuments()
}

export async function createQuestion(dto: CreateQuestionDto): Promise<IQuestion> {
    return questionModel.create(dto)
}

export async function updateQuestion(id: string, dto: CreateQuestionDto): Promise<IQuestion | null> {
    return questionModel.findByIdAndUpdate(id, dto, { new: true })
}

export async function deleteQuestion(id: string): Promise<void> {
    await questionModel.findByIdAndDelete(id)
}
