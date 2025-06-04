import mongoose, { mongo } from "mongoose";

const pollOptionSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
    text: {
        type: String,
        require: true
    },
    votes: {
        type: Number,
        default: 0
    },
    userVotes: {
        type: Array,
        default: []
    }
})

const PollOption = mongoose.model('PollOption', pollOptionSchema);
export default PollOption;