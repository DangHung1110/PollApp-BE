import { Router as ExpressRouter } from "express";
import AuthController from "../controller/authController.js";
import UserValidator from "../middleware/middleware.js"; 
import AuthMiddleware from "../middleware/checkAuth.js"; 
import asyncHanle from "../middleware/asyncHandle.js";


class AuthRouter {
  constructor() {
    this.router = ExpressRouter();
    this.authController = new AuthController();  
    this.authValidator = new UserValidator();   
    this.authMiddleware = new AuthMiddleware(); 
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post("/auth/register", this.authValidator.checkUserValidate, asyncHanle(this.authController.register));// register
    this.router.post("/auth/login", asyncHanle(this.authController.login));// login
    this.router.post("/auth/refresh-token", asyncHanle(this.authController.refreshToken)); // refresh token
    this.router.post("/auth/logout", asyncHanle(this.authController.logout));// logout
    this.router.get("/auth/me", this.authMiddleware.checkAuth, asyncHanle(this.authController.getMe)); // get user info
    this.router.post("/auth/forgot-password", asyncHanle(this.authController.forgotPassword)); // forgot password
    this.router.post("/auth/reset-password", asyncHanle(this.authController.resetPassword)); // reset password
  }
}

export default AuthRouter;