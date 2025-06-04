import { AuthFailureError } from "../handler/error.reponse";
import { CheckAuth } from "./checkAuth.js";
class AdminMiddleware {
    async checkAdmin(req, res, next) {
        await CheckAuth.checkAuth(req, res, next);
        if(req.user?.role !== 'admin') {
            throw new AuthFailureError("You are not authorized to perform this action");
        }
        next();
    }
}

export default AdminMiddleware;