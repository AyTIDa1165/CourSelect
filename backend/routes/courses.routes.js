import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { getAllCourses, getCourseData } from "../controllers/course.controller.js";

const courseRouter = express.Router();

courseRouter.get("/", auth(), getAllCourses);
courseRouter.get("/:acronym", auth(), getCourseData);

export default courseRouter;