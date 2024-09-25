import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export enum UserRole { ADMIN = 'ADMIN', USER = 'USER' }

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    linkedInUrl: {
        type: String
    },
    gitHubUrl: {
        type: String
    },
    authorisationRole: {
        type: String,
        enum: [UserRole.ADMIN, UserRole.USER],
        required: true
    },
})

const userModel = mongoose.model('User', userSchema);

export default userModel;