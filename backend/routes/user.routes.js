import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { getUserData, getUserProfileData, updateUserProfileData } from "../controllers/user.controller.js"
const userRouter = express.Router(); 

userRouter.get("/is-auth", auth(), (req, res) => {
    return res.status(200).json({
        success : true,
        message : "Authenticated."
    });
});

userRouter.get("/data", auth(), getUserData);

userRouter.get("/:username", auth(), getUserProfileData);

userRouter.put("/", auth(), updateUserProfileData);

export default userRouter;