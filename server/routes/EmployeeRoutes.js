import express from "express";
const router = express.Router();
import * as employee from "../controller/employeeController.js";

router.post("/offerletter", employee.GenerateOfferLetter);
router.post("/icc", employee.GenerateICC);
router.post("/lor", employee.GenerateLOR);
router.get("/offerLetter", employee.downloadOfferLetter);
router.get("/icc", employee.downloadICC);
router.get("/lor", employee.downloadLOR);

export default router;
