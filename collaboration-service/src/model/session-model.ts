import mongoose, { Schema } from "mongoose";

interface Session {
    session_id: string;
    date_created: Date;
    participants: string[];
    question: string;
    code: string;
    active?: boolean;
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
    question: { type: String, required: true },
    code: { type: String, required: true },
    active: { type: Boolean, default: true }
});

export default mongoose.model<Session>("Session", sessionSchema);