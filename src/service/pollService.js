import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.reponse.js"
import Poll from "../model/pollModel.js";
import PollOption from "../model/pollOptionModel.js";

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

            // Check if user is creator
            if (poll.creator.toString() !== updateData.creator) {
                throw new AuthFailureError("Not authorized to update this poll");
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
}

export default PollService;