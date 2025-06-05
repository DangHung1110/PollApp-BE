import AuthService from '../service/authService.js';
import { OK } from '../handler/success.handle.js';
import { AuthFailureError } from '../handler/error.reponse.js';

const service = new AuthService();

class AuthController {
    async register(req, res, next) {
        try {
            const user = await service.register(req.body);
            new OK({
                message: 'User created successfully',
                metadata: {
                    newUser: user
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await service.login(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // prevent client-side JS from accessing the cookie
                secure: process.env.NODE_ENV === 'production', // use secure cookies in production
                sameSite: 'strict', // prevent CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            new OK({
                message: "Login successful",
                metadata: {
                    accessToken
                }
            }).send(res, next);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const oldRefreshToken = req.cookies.refreshToken;

            const { accessToken } = await service.refreshToken(oldRefreshToken);

            new OK({
                message: "Refresh token successful",
                metadata: {
                    accessToken
                }
            }).send(res)
        } catch (error) {
            next(error);
        }
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

    async getCurrentUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await service.getUserById(userId);
            new OK({
                message: 'Get user successfully',
                metadata: {
                    user
                }
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const result = await service.forgotPassword(req.body.email);
            new OK({
                message: result.message,
                metadata: {
                    token: result.token
                }
            }).send(res);
        } catch (err) {
            next(err);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const {email, token, newPassword } = req.body;
            const result = await service.resetPassword(email, token, newPassword);
            new OK({ message: result.message }).send(res);
        } catch (err) {
            next(err);
        }
    }
}

export default AuthController;
