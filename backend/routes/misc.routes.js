import express from "express";
import { getLandingPageData } from "../controllers/misc.controller.js";

const miscRouter = express.Router();

miscRouter.get("/landing", getLandingPageData);

export default miscRouter;