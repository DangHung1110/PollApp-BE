import express from 'express';
import AuthMiddleware  from '../middleware/checkAuth.js';
import PollController from '../controller/pollController.js';
import asynHandle from '../middleware/asyncHandle.js';

class PollRouter {
    constructor() {
        this.router = express.Router();
        this.authMiddleware = new AuthMiddleware();
        this.pollController = new PollController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/polls/create', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.pollController.createPoll));// create a new poll
        this.router.put('/polls/:pollId', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.pollController.updatePoll));// update an existing poll
    }
}

export default PollRouter;