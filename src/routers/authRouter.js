import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateBody } from "../middleware/validation.js";
import { registerUserSchema, loginUserSchema } from "../models/user.js";

const router = Router()

router.post('/register', validateBody(registerUserSchema), registerUser)
router.post('/login', validateBody(loginUserSchema), loginUser)

export default router