import express from 'express';
import { getAllUsers, getUserById, deleteUser } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;
