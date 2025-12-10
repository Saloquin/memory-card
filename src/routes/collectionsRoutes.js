import express from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  grantAccess,
  revokeAccess,
  searchPublicCollections,
  getMyCollections
} from '../controllers/collectionsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', authMiddleware, searchPublicCollections);
router.get('/my', authMiddleware, getMyCollections);
router.get('/', authMiddleware, getAllCollections);
router.get('/:id', authMiddleware, getCollectionById);
router.post('/', authMiddleware, createCollection);
router.put('/:id', authMiddleware, updateCollection);
router.delete('/:id', authMiddleware, deleteCollection);
router.post('/:id/access', authMiddleware, grantAccess);
router.delete('/:id/access/:userId', authMiddleware, revokeAccess);

export default router;
