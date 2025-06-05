import express from 'express';
import UserController from '../controller/userController.js';
import AuthMiddleware from '../middleware/checkAuth.js';
import AdminMiddleware from '../middleware/adminMiddleware.js';
import asyncHandle from '../middleware/asyncHandle.js';
import userMiddleware from '../middleware/userMiddleware.js';

class UserRouter {
    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.authMiddleware = new AuthMiddleware();
        this.adminMiddleware = new AdminMiddleware();
        this.userMiddleware = new userMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
    this.router.get('/users', asyncHandle(this.authMiddleware.checkAuth), asyncHandle(this.adminMiddleware.checkAdmin), asyncHandle(this.userController.getAllUsers));
    this.router.get('/users/:id', asyncHandle(this.authMiddleware.checkAuth), asyncHandle(this.adminMiddleware.checkAdmin), asyncHandle(this.userController.getUserById));
    this.router.post('/users', asyncHandle(this.authMiddleware.checkAuth), asyncHandle(this.adminMiddleware.checkAdmin), asyncHandle(this.userController.addUser));
    this.router.put('/users/:id', asyncHandle(this.authMiddleware.checkAuth), asyncHandle(this.adminMiddleware.checkAdmin), asyncHandle(this.userController.updateUser));
    this.router.delete('/users/:id', asyncHandle(this.authMiddleware.checkAuth), asyncHandle(this.adminMiddleware.checkAdmin), asyncHandle(this.userController.deleteUser));
    this.router.get('/me', asyncHandle(this.authMiddleware.checkAuth), asyncHandle(this.userMiddleware.checkUser), asyncHandle(this.userController.getMe));

    }
}

export default UserRouter;