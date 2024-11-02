import { Schema, Types, model, models, Document } from 'mongoose';

export interface ISuccessfulMatch extends Document {
    collaborators: [Types.ObjectId],
    questionId: number,
    attempts: [Types.ObjectId]
}   

const SuccessfulMatchSchema = new Schema<ISuccessfulMatch>(
    {
        collaborators: { type: [Types.ObjectId], required: true },
        questionId: { type: Number, required: true, index: true },
        attempts: [{ type: [Types.ObjectId], default: [] }]
    },
    {
        timestamps: true,
    }
);

const SuccessfulMatch = models.SuccessfulMatch || model<ISuccessfulMatch>('SuccessfulMatch', SuccessfulMatchSchema);

export default SuccessfulMatch;