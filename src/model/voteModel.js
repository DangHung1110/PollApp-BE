const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  optionIndex: {
    type: Number, // index của option trong mảng `options` của poll
    required: true
  }
}, { timestamps: true });

voteSchema.index({ user: 1, poll: 1 }, { unique: true }); // 1 user chỉ được vote 1 lần / poll

module.exports = mongoose.model('Vote', voteSchema);
