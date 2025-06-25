import express from "express"
import dotenv from "dotenv"
import methodOverride from "method-override"
import instanceMongoDB from "./src/config/dbConfig.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/handler/error.handle.js";
import AuthRouter from "./src/router/authRouter.js";
import PollRouter from "./src/router/pollRouter.js";
import VoteRouter from "./src/router/voteRouter.js";
import UserRouter from "./src/router/userRouter.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Middleware
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

// Kết nối database
instanceMongoDB.connect();

// Khởi tạo router
const authRouter = new AuthRouter();
const pollRouter = new PollRouter();
const voteRouter = new VoteRouter();
const userRouter = new UserRouter();
// Thiết lập routes
app.use('/api/v1', authRouter.router);
app.use('/api/v1', pollRouter.router);
app.use('/api/v1', voteRouter.router);
app.use('/api/v1', userRouter.router);
app.get('/', (req, res) => {
    res.status(200).json({message: 'Test CI/CD'})
})
app.use('*', (req, res) => {
    res.status(404).json({error: 'resource not found'})
})


app.use(errorHandler)
// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
