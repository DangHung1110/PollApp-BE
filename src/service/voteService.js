import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.reponse.js"
import Poll from "../model/pollModel.js";
import PollOption from "../model/pollOptionModel.js";
import Vote from "../model/voteModel.js";
import user from '../model/userModel.js';

class VoteService {
    async createVote({ pollId, userId, optionId }) {
        try {
            // Validate required fields
            if (!pollId || !userId || !optionId) {
                throw new BadRequestError("Poll ID, User ID and Option ID are required");
            }

            const poll = await Poll.findById(pollId);
            if (!poll) {
                throw new NotFoundError("Poll not found");
            }

            if (poll.isLocked) {
                throw new ConflictRequestError("Poll is locked and cannot accept votes");
            }

            // Tìm option trong poll.options array
            console.log('Looking for optionId:', optionId);
            console.log('Available options:', poll.options.map(opt => opt._id));

            const option = poll.options.find(opt => opt._id.toString() === optionId.toString());
            if (!option) {
                throw new NotFoundError("Option not found in this poll");
            }

            // Get option index
            const optionIndex = poll.options.findIndex(opt =>
                opt._id.toString() === optionId.toString()
            );

            // Check if user has already voted
            const existingVote = await Vote.findOne({ 
                poll: pollId, 
                user: userId,
                option: optionId 
            });
            if (existingVote) {
                throw new ConflictRequestError("You have already voted for this option");
            }

            // Create new vote with optionIndex
            const vote = new Vote({
                poll: pollId,
                user: userId,
                option: optionId,
                optionIndex: optionIndex
            });

            await vote.save();

            // Update poll option votes
            option.votes += 1;
            option.userVotes.push(userId);
            await poll.save();

            return vote;
        } catch (error) {
            throw error;
        }
    }

    async unVote({ pollId, userId }) {
        try {
            if (!pollId || !userId) {
                throw new BadRequestError("Poll ID and User ID are required");
            }

            const poll = await Poll.findById(pollId);
            if (!poll) {

                
                throw new NotFoundError("Poll not found");
            }

            const vote = await Vote.findOne({ poll: pollId, user: userId });
            if (!vote) {
                throw new NotFoundError("Vote not found");
            }

            // Xóa vote
            await Vote.deleteOne({ _id: vote._id });

            // ⚠️ Cập nhật option trong poll.options (embedded)
            const option = poll.options.find(opt => opt._id.toString() === vote.option.toString());
            if (option) {
                option.votes = Math.max(option.votes - 1, 0); // tránh âm
                option.userVotes = option.userVotes.filter(id => id.toString() !== userId);
            }

            await poll.save();

            return { message: "Vote removed successfully" };
        } catch (error) {
            throw error;
        }
    }

}

export default VoteService;