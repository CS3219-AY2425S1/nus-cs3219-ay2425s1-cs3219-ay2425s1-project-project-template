import { Schema, model, models, Document } from 'mongoose';

export interface ISubmission extends Document {
    collaborators: number[]
    questionId: number
    language: string
    code: string
    solved: boolean
    testCasesPassed: number
    testCasesTotal: number
}   

const SubmissionSchema = new Schema<ISubmission>(
    {
        collaborators: { type: [Number], required: true, default: [] },
        questionId: { type: Number, required: true, index: true },
        language: { type: String, required: true },
        code: { type: String, required: true, default: '' },
        solved: { type: Boolean },
        testCasesPassed: { type: Number, default: 0 },
        testCasesTotal: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Submission = models.Submission || model<ISubmission>('Submission', SubmissionSchema);

export default Submission;