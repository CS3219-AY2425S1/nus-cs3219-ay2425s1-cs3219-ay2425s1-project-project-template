import { Proficiency } from '@repo/user-types/Proficiency'
import { Role } from '@repo/user-types/Role'
import { Schema } from 'mongoose'
import { IUser } from '../types/IUser'

const userSchema = new Schema<IUser>(
    {
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
        verificationToken: {
            type: String,
            required: false,
            default: '0',
        },
    },
    {
        timestamps: true,
    }
)

userSchema.index({ username: 'text', email: 'text' })

export default userSchema
