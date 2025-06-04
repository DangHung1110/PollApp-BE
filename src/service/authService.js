import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError } from "../handler/error.reponse.js"
import mailService from '../utils/mailer.js';
import bcrypt from 'bcrypt';

dotenv.config();

const SECRET_KEY = process.env.TOKEN_SECRET_KEY

class AuthService {
    async register({ name, email, password, role }) {
        const exists = await User.findOne({ email });
        if (exists) {
            throw new ConflictRequestError("Email already exists!");
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, role });
        await user.save();

        return { User };
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new BadRequestError("Invalid email or password!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new BadRequestError("Invalid email or password!");

        const payload = { id: user._id, email: user.email, role: user.role };
        console.log(payload);
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

        return {
            accessToken,
            refreshToken,
            message: "Đăng nhập thành công"
        };
    }

    async refreshToken(oldRefreshToken) {
        return new Promise((resolve, reject) => {
            if (!oldRefreshToken) {
                return reject(new AuthFailureError('Refresh token not found'));
            } else {
                jwt.verify(oldRefreshToken, SECRET_KEY, (err, user) => {
                    if (err) {
                        return reject(new AuthFailureError('Invalid refresh token'));
                    }
                    const payload = { id: user.id, email: user.email, role: user.role };
                    const newAccessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });

                    resolve({ accessToken: newAccessToken });
                });
            }
        })
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                res.clearCookie('refreshToken');
                new OK({
                    message: "Log out successfully!"
                }).send(res)
            }
            else {
                throw new AuthFailureError("Refresh token not found!");
            }
        } catch (error) {
            next(error);
        }
    }

    async getUserById(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Tạo token reset password
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1 giờ

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetTokenExpire;
        await user.save();

        // Gửi email
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
        await mailService.sendMail({
            to: email,
            subject: "Password Reset",
            html: `<p>Click vào link sau để đặt lại mật khẩu: <a href="${resetUrl}">${resetUrl}</a></p>`
        });

        return { message: "Password reset email sent" };
    }

    async resetPassword(email, token, newPassword) {
        const user = await User.findOne({
            email,
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new BadRequestError('Invalid or expired password reset token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return { message: "Password has been reset successfully" };
    }
}

export default AuthService;
