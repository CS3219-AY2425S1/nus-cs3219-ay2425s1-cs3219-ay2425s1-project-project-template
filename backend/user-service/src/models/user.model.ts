import { Schema, model } from 'mongoose'
import { IUser } from '../types/IUser'
import { Proficiency } from '../types/Proficiency'
import { Role } from '../types/Role'

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
    },
    proficiency: {
        type: String,
        enum: Object.values(Proficiency),
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false,
        default: null,
    },
    deletedAt: {
        type: Date,
        required: false,
        default: null,
    },
})

export default model<IUser>('User', UserSchema)
