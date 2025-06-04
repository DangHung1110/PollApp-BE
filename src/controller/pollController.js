import PollSerivce from '../service/pollService.js';
import { OK, CREATED } from '../handler/success.handle.js';

class PollController {
    constructor() {
        this.pollService = new PollSerivce();

        this.createPoll = this.createPoll.bind(this);
        this.updatePoll = this.updatePoll.bind(this);
    }

    async createPoll(req, res, next) {
        try {
            const { title, description, options, expiresAt } = req.body;
            const creator = req.user.id
            const pollData = {
                title,
                description,
                options,
                creator,
                expiresAt,
            };

            const newPoll = await this.pollService.createPoll(pollData);
            new CREATED({
                message: 'Poll created successfully',
                metadata: {
                    poll: newPoll
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updatePoll(req, res, next) {
        try {
            const creator = req.user.id;
            const pollId = req.params.pollId;
            const { title, description, options, expiresAt, isLocked } = req.body;

            const updateData = {
                title,
                description,
                options,
                expiresAt,
                isLocked,
                creator
            };

            const updatedPoll = await this.pollService.updatePoll(pollId, updateData);
            new OK({
                message: 'Poll updated successfully',
                metadata: {
                    poll: updatedPoll
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default PollController;