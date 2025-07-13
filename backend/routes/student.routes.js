import express from "express";
import auth from "../middlewares/auth.middleware.js";

const studentRouter = express.Router();

studentRouter.use(auth('STUDENT')); // "STUDENT" Or "ADMIN" Or "PROFESSOR"

export default studentRouter;