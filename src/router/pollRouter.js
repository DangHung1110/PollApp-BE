import express from 'express';
import AuthMiddleware  from '../middleware/checkAuth.js';
import PollController from '../controller/pollController.js';
import asynHandle from '../middleware/asyncHandle.js';
import AdminMiddleware from '../middleware/adminMiddleware.js';

class PollRouter {
    constructor() {
        this.router = express.Router();
        this.authMiddleware = new AuthMiddleware();
        this.pollController = new PollController();
        this.adminMiddleware = new AdminMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/polls/create', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.adminMiddleware.checkAdmin), asynHandle(this.pollController.createPoll));// create a new poll
        this.router.put('/polls/:pollId', asynHandle(this.adminMiddleware.checkAdmin), asynHandle(this.pollController.updatePoll));// update an existing poll
        this.router.get('/polls/:pollId', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.pollController.getPollById));// get a poll by ID
        this.router.get('/polls', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.pollController.getAllPolls));// get all polls
        this.router.delete('/polls/:pollId', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.adminMiddleware.checkAdmin), asynHandle(this.pollController.deletePoll));// delete a poll
        this.router.post('/polls/:pollId/addOptions', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.adminMiddleware.checkAdmin), asynHandle(this.pollController.addOptionPoll));// add an option to a poll
        this.router.put('/polls/:pollId/removeOptions/:optionId', asynHandle(this.authMiddleware.checkAuth), asynHandle(this.adminMiddleware.checkAdmin), asynHandle(this.pollController.updateOptionPoll));// update an option in a poll
    }
}

export default PollRouter;