import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSessionSchema = new Schema({
    users: {
        type: [String],
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export default mongoose.model('UsersSession', usersSessionSchema);
