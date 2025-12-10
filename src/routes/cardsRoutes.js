import express from 'express';
import {
  getCardsByCollection,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardsToReview
} from '../controllers/cardsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/collection/:collectionId', authMiddleware, getCardsByCollection);
router.get('/collection/:collectionId/review', authMiddleware, getCardsToReview);
router.get('/:id', authMiddleware, getCardById);
router.post('/', authMiddleware, createCard);
router.put('/:id', authMiddleware, updateCard);
router.delete('/:id', authMiddleware, deleteCard);

export default router;
