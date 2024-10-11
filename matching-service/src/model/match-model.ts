import mongoose, { Schema, Document } from 'mongoose';

export interface MatchRequest extends Document {
    userId: string;
    topic: string;
    difficulty: string;
    status: string;
}

const MatchRequestSchema = new Schema<MatchRequest>({
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    status: { type: String, enum: ['waiting', 'matched', 'cancelled'], default: 'waiting' },
});

export const MatchRequestModel = mongoose.model<MatchRequest>('MatchRequest', MatchRequestSchema);
