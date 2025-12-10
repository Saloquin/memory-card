import express from 'express';
import {
  recordRevision,
  getUserRevisions,
  getCardRevision,
  getAllLevels
} from '../controllers/studyController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/revisions', authMiddleware, recordRevision);
router.get('/revisions', authMiddleware, getUserRevisions);
router.get('/revisions/:cardId', authMiddleware, getCardRevision);
router.get('/levels', authMiddleware, getAllLevels);

export default router;
