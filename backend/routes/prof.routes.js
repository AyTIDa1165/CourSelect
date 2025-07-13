import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { getAllProfs } from "../controllers/prof.controller.js";

const profRouter = express.Router();

profRouter.get("/", auth(), getAllProfs);

export default profRouter;