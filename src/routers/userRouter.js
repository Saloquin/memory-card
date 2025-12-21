import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getOneUser,
} from "../controllers/userController.js";
import checkAdmin from "../middleware/checkAdmin.js";
import { userIdSchema } from "../models/user.js";
import { validateParams } from "../utils/validation.js";

const router = Router();

router.use(checkAdmin);

router.get("/", getAllUsers);
router.get("/:id", validateParams(userIdSchema), getOneUser);
router.delete("/:id", validateParams(userIdSchema), deleteUser);
export default router;
