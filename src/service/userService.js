import { NotFoundError, ConflictRequestError } from "../handler/error.reponse.js";
import User from '../model/userModel.js';
import Vote from '../model/voteModel.js';
import bcrypt from 'bcrypt';

class UserService {
    constructor() {
        this.userModel = User;
        this.voteModel = Vote;
    }

    async getAllUsers() {
        try {
            const users = await this.userModel.find({}).select('-password');
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    async getUserById(id) {
        const user = await this.userModel.findOne({ _id: id }).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async addUser(userData) {
        // Check email duplicate
        const emailExists = await this.userModel.findOne({ email: userData.email });
        if (emailExists) {
            throw new ConflictRequestError("Email already exists!");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new this.userModel({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: "user" // Default role
        });

        await newUser.save();
        return newUser;
    }

    async updateUser(id, updateData) {
        // Check if user exists
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Check email duplicate if email is being updated
        if (updateData.email) {
            const emailExists = await this.userModel.findOne({
                email: updateData.email,
                _id: { $ne: id }
            });
            if (emailExists) {
                throw new ConflictRequestError("Email already exists!");
            }
        }

        // Hash password if it's being updated
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            { 
                name: updateData.name,
                email: updateData.email,
                password: updateData.password,
                role: updateData.role
            },
            { new: true }
        ).select('-password');

        return updatedUser;
    }

    async deleteUser(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Delete user and their votes
        await Promise.all([
            this.userModel.deleteOne({ _id: id }),
            this.voteModel.deleteMany({ user: id })
        ]);

        return user;
    }

    async getMe(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }
}

export default UserService;