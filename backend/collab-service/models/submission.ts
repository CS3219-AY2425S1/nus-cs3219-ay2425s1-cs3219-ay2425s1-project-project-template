import { Schema, model, models, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
    submissionId: number
    collaborators: Types.ObjectId[]
    questionId: number
    language: string
    code: string
    solved: boolean
}   

const SubmissionSchema = new Schema<ISubmission>(
    {
        submissionId: { type: Number, required: true, unique: true },
        collaborators: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        questionId: { type: Number, required: true, index: true },
        language: { type: String, required: true },
        code: { type: String, required: true, default: '' },
        solved: { type: Boolean }, // will update this when code execution is implemented
    },
    {
        timestamps: true,
    }
);

const Submission = models.Submission || model<ISubmission>('Submission', SubmissionSchema);

export default Submission;