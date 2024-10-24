import mongoose, { Schema } from "mongoose";

interface Session {
    session_id: string,
    date_created: Date,
    participants: string[],
    questionDescription : string,
    questionTemplateCode : string,
    questionTestcases : string[],
    active: boolean
    yDoc: Buffer
}

const sessionSchema: Schema = new Schema({
    session_id: { type: String, unique: true },
    date_created: { type: Date, required: true },
    participants: {
        type: [String],
        required: true,
        validate: {
            validator: (v: string[]) => v.length == 2},
            message: "A session must have exactly 2 participants.",
        },
    questionDescription: { type: String, required: true },
    questionTemplateCode: { type: String, required: true },
    questionTestcases: { type: [String], required: true },
    active: { type: Boolean, default: true },
    yDoc: { type: Buffer, required: true }
});

export default mongoose.model<Session>("Session", sessionSchema);
