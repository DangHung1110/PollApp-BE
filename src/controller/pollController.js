import PollSerivce from '../service/pollService.js';
import { OK, CREATED } from '../handler/success.handle.js';


class PollController {
    constructor() {
        this.pollService = new PollSerivce();

        this.createPoll = this.createPoll.bind(this);
        this.updatePoll = this.updatePoll.bind(this);
        this.deletePoll = this.deletePoll.bind(this);
        this.getAllPolls = this.getAllPolls.bind(this);
        this.getPollById = this.getPollById.bind(this);
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

    async deletePoll(req, res, next) {
        try {
            const pollId = req.params.pollId;
            await this.pollService.deletePoll(pollId);
            new OK({
                message: 'Poll deleted successfully'
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getAllPolls(req, res, next) {
        try {
            const polls = await this.pollService.getAllPolls(req.query);
            new OK({
                message: 'Polls retrieved successfully',
                metadata: {
                    polls
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getPollById(req, res, next) {
        try {
            const pollId = req.params.pollId;
            const poll = await this.pollService.getPollById(pollId);
            new OK({
                message: 'Poll retrieved successfully',
                metadata: {
                    poll
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async addOptionPoll (req, res, next) {
        try {
            const pollId = req.params.pollId;
            const { option } = req.body;

            const updatedPoll = await this.pollService.addOptionPoll(pollId, option);
            new OK({
                message: 'Option added successfully',
                metadata: {
                    poll: updatedPoll
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async removeOptionPoll(req, res, next) {
        try {
            const pollId = req.params.pollId;
            const { optionId } = req.body;

            const updatedPoll = await this.pollService.removeOptionPoll(pollId, optionId);
            new OK({
                message: 'Option removed successfully',
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