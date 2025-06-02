import mongoose from 'mongoose';
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    default: 0
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [optionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;
