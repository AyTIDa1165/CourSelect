import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { checkDBConnection } from "./config/postgres.js";
import { checkRedisConnection } from "./config/redis.js";
import prisma from "./prisma/index.js";
import authRouter from "./routes/auth.routes.js";
import studentRouter from "./routes/student.routes.js";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/reviews.routes.js";
import courseRouter from "./routes/courses.routes.js";
import profRouter from "./routes/prof.routes.js";
import miscRouter from "./routes/misc.routes.js";
import "./jobs/scheduler.js";

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin : process.env.FRONTEND_URL || "http://localhost:5173",
  methods : ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// API Endpoints
app.use('/api/v1/auth', authRouter); // Public Routes
app.use('/api/v1/user', userRouter); // User Routes
app.use('/api/v1/student', studentRouter); // Student Routes
app.use('/api/v1/review', reviewRouter); // Reviews Routes
app.use('/api/v1/course', courseRouter); // Course Routes
app.use('/api/v1/prof', profRouter); // Prof Routes
app.use('/api/v1/misc', miscRouter); // Miscellaneous Routes

const startServer = async () => {
    await checkDBConnection(); // Ensuring DB connection before starting
    await checkRedisConnection(); // Ensuring Redis connection before starting
    app.listen(PORT, () => {
      console.log(`Server running on PORT : ${PORT}`);
    });
};

startServer(); //  Starting the backend

// Just for good logging
process.on('SIGINT', async () => {
    console.log('... Backend Shutting Down ...');
    await prisma.$disconnect();
    console.log('... Prisma Client Disconnected ...');
    process.exit(0);
});
