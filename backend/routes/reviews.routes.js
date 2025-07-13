import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { addReview, deleteReview, getAllReviews, searchReview, addVote, reportReview } from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.get("/", auth(), getAllReviews);
reviewRouter.post("/add", auth(), addReview);
reviewRouter.delete("/:id", auth(), deleteReview);
reviewRouter.post("/search", auth(), searchReview);
reviewRouter.post("/addVote", auth(), addVote);
reviewRouter.post("/report-review/:reviewId", auth(), reportReview);

export default reviewRouter;