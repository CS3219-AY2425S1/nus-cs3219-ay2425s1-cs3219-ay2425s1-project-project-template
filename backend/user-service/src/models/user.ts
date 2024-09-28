import { Schema, model, models, Document, Types } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    attemptedQuestions: Types.ObjectId[];
    completedQuestions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        attemptedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
        completedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    },
    {
        timestamps: true,
    }
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;
