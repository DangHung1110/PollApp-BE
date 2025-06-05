import UserService from '../service/userService.js';
import { OK, CREATED } from '../handler/success.handle.js';

class UserController {
    constructor() {
        this.userService = new UserService();
        
        // Bind methods
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.addUser = this.addUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getMe = this.getMe.bind(this);
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await this.userService.getAllUsers();
            new OK({
                message: "Get users successfully",
                metadata: { users }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            new OK({
                message: "Get user successfully",
                metadata: { user }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async addUser(req, res, next) {
        try {
            const userData = req.body;
            const newUser = await this.userService.addUser(userData);
            new CREATED({
                message: "User created successfully",
                metadata: { user: newUser }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await this.userService.updateUser(id, updateData);
            new OK({
                message: "User updated successfully",
                metadata: { user: updatedUser }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            new OK({
                message: "User deleted successfully"
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const userId = req.user.id; // From auth middleware
            const user = await this.userService.getMe(userId);
            new OK({
                message: "Get profile successfully",
                metadata: { user }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;