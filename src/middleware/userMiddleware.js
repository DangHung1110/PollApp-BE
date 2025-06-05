import { AuthFailureError } from "../handler/error.reponse.js";

class userMiddleware {
    async checkUser(req, res, next) {
        try {
            // Kiểm tra xem req.user có tồn tại không
            if (!req.user) {
                throw new AuthFailureError("Unauthorized");
            }
            
            // Kiểm tra role admin
            if (req.user.role !== 'user') {
                throw new AuthFailureError("You are not authorized to perform this action");
            }
            
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default userMiddleware;