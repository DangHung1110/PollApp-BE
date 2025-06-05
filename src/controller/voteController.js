import VoteService from '../service/voteService.js';
import { OK, CREATED } from '../handler/success.handle.js';

class VoteController {
    constructor() {
        this.voteService = new VoteService();

        this.createVote = this.createVote.bind(this);
        this.unVote = this.unVote.bind(this);
    }

    async createVote(req, res, next) {
        try {
            const { pollId, optionId } = req.body;
            const userId = req.user.id;
            console.log("Body:", req.body);
            console.log("User:", req.user);


            const vote = await this.voteService.createVote({ pollId, userId, optionId });
            new CREATED({
                message: 'Vote created successfully',
                metadata: { vote }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async unVote(req, res, next) {
        try {
            const pollId = req.params.pollId;
            const userId = req.user.id;

            const result = await this.voteService.unVote({ pollId, userId });
            new OK({
                message: 'Vote removed successfully',
                metadata: { result }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default VoteController;