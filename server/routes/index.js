import express from "express";
import userRouter from "./userRoutes.js";
import employeeRouter from "./EmployeeRoutes.js";
const router = express.Router();
router.use("/user", userRouter);
router.use("/employee", employeeRouter);
export default router;
