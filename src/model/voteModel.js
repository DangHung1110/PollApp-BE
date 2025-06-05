import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    option: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    optionIndex: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;