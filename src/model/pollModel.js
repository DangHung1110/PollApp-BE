import mongoose from 'mongoose';
import pollOptionSchema from './pollOptionModel.js';
const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  options: [pollOptionSchema.schema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setDate(now.getDate() + 7); // Mặc định là 7 ngày kể từ ngày tạo
      return now;
    }
  }
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;
