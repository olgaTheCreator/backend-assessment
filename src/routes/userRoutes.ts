import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  personalInformation,
} from "../controllers/userController";

export const userRouter = express.Router();

//register user
userRouter.post("/register", registerUser);

//login user
userRouter.post("/login", loginUser);

// change password
userRouter.post("/actions/changepassword", changePassword);

userRouter.get("/profiles", personalInformation);
