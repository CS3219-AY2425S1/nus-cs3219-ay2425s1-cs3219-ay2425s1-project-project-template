import mongoose, { Schema } from "mongoose";

interface Session {
    session_id: number;
    date_created: Date;
    participants: string[];
    question: string;
    code: string;
}

const sessionSchema: Schema = new Schema({
    session_id: { type: Number, unique: true },
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
});

export default mongoose.model<Session>("Session", sessionSchema);