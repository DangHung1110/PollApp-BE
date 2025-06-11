import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.reponse.js"
import Poll from "../model/pollModel.js";
import PollOption from "../model/pollOptionModel.js";
import Vote from "../model/voteModel.js";
import user from '../model/userModel.js';

class PollService {
    async createPoll({ title, description, options, creator, expiresAt }) {
        try {
            // Validate required fields
            if (!title || !options || !creator) {
                throw new BadRequestError("Title, options and creator are required");
            }

            const newPoll = new Poll({
                title,                                    
                description,                              
                options: options.map(option => ({         
                    text: option,
                    votes: 0,
                    userVotes: []
                })),
                creator,                                  
                isLocked: false,
                expiresAt: expiresAt || undefined        
            });

            await newPoll.save();
            return newPoll;
        } catch (error) {
            throw error;
        }
    }

    async updatePoll(pollId, updateData) {
        try {
            const poll = await Poll.findById(pollId);
            if (!poll) {
                throw new NotFoundError("Poll not found");
            }

            // Update only allowed fields
            const updatedPoll = await Poll.findByIdAndUpdate(
                pollId,
                {
                    title: updateData.title,
                    description: updateData.description,
                    options: updateData.options.map(option => ({
                        text: option,
                        votes: 0,
                        userVotes: []
                    })),
                    expiresAt: updateData.expiresAt,
                    isLocked: updateData.isLocked
                },
                { new: true }  // Return updated document
            );

            return updatedPoll;
        } catch (error) {
            throw error;
        }
    }

    async deletePoll(pollId) {
        try {
            const poll = await Poll.findById(pollId);
            if (!poll) {
                throw new NotFoundError("Poll not found");
            }

            await Poll.deleteOne({ _id: pollId });
            await Vote.deleteOne({ poll: pollId });
            return poll;
        }
        catch (error) {
            throw error;
        }
    }

    async getPollById(pollId) {
        try {
            const poll = await Poll.findById(pollId).populate('creator', 'name email');
            if (!poll) {
                throw new NotFoundError("Poll not found");
            }
            return poll;
        } catch (error) {
            throw error;
        }
    }

    async getAllPolls(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 2;
        const skip = (page - 1) * limit;

        const total = await Poll.countDocuments({ isLocked: false });
        const polls = await Poll.find({ isLocked: false })
            .skip(skip)  
            .limit(limit)
            .populate('creator', 'name email')
            .sort({ createdAt: -1 });

        return {
            total,
            page,
            limit,
            polls
        }
    }

    async addOptionPoll(pollId, optionText) {
        try {
            const poll = await Poll.findById(pollId);
            if (!poll) {
                throw new NotFoundError("Poll not found");
            }

            const newOption = new PollOption({
                text: optionText,
                votes: 0,
                userVotes: []
            });

            poll.options.push(newOption);
            await poll.save();
            return newOption;
        } catch (error) {
            throw error;
        }
    }

    async removeOptionPoll(pollId, optionId) {
        try {
            const poll = await Poll.findById(pollId);
            if (!poll) {
                throw new NotFoundError("Poll not found");
            }

            // Debug log to check the values
            console.log('OptionId to remove:', optionId);
            console.log('Available options:', poll.options.map(opt => ({
                id: opt._id.toString(),
                text: opt.text
            })));

            // Fixed comparison using toString() on both sides
            const optionIndex = poll.options.findIndex(
                option => option._id.toString() === optionId.toString()
            );

            if (optionIndex === -1) {
                throw new NotFoundError("Option not found in this poll");
            }

            // Remove the option
            poll.options.splice(optionIndex, 1);
            await poll.save();
            
            return {
                message: "Option removed successfully",
                poll
            };
        } catch (error) {
            throw error;
        }
    }
}

export default PollService;