import express from "express";
import {
  userRegistration,
  userLogin,
  getUserById
} from "../controller/userController.js";
const userRouter = express.Router();

// Public Routes
userRouter.post("/signup", userRegistration);
userRouter.post("/login", userLogin);
userRouter.get("/getUser/:id", getUserById);

export default userRouter;
