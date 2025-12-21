import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { loginUserSchema, registerUserSchema } from "../models/user.js";
import { validateBody } from "../utils/validation.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), registerUser);
router.post("/login", validateBody(loginUserSchema), loginUser);

export default router;
