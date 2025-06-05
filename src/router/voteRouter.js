import express from 'express';
import AuthMiddleware  from '../middleware/checkAuth.js';
import asynHandle from '../middleware/asyncHandle.js';
import userMiddleware from '../middleware/userMiddleware.js';
import VoteController from '../controller/voteController.js';

class VoteRouter {
    constructor() {
        this.router = express.Router();
        this.authMiddleware = new AuthMiddleware();
        this.VoteController = new VoteController();
        this.userMiddleware = new userMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/polls/:pollId/vote', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.userMiddleware.checkUser), asynHandle(this.VoteController.createVote));// vote for a poll
        this.router.delete('/polls/:pollId/unVote', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.userMiddleware.checkUser), asynHandle(this.VoteController.unVote));// unvote for a poll}
    }
}

export default VoteRouter;