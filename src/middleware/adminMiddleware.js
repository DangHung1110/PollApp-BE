import { AuthFailureError } from "../handler/error.reponse.js";

class AdminMiddleware {
    async checkAdmin(req, res, next) {
        try {
            if (!req.user) {
                throw new AuthFailureError("Unauthorized");
            }
            
            // Kiểm tra role admin
            if (req.user.role !== 'admin') {
                throw new AuthFailureError("You are not authorized to perform this action");
            }
            
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default AdminMiddleware;