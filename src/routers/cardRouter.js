import { Router } from "express";
import { 
    getOneCard,
    getCardsByCollection,
    getCardsToReview,
    createCard,
    updateCard,
    deleteCard,
    reviewCard
} from "../controllers/cardController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { createCardSchema, cardIdSchema } from "../models/card.js";
import { collectionIdSchema } from "../models/collection.js";
import checkToken from "../middleware/checkToken.js";

const router = Router();

router.use(checkToken);
router.post('/', validateBody(createCardSchema), createCard);
router.get('/:id', validateParams(cardIdSchema), getOneCard);
router.get('/collection/:id', validateParams(collectionIdSchema), getCardsByCollection);
router.get('/collection/:id/review', validateParams(collectionIdSchema), getCardsToReview);
router.put('/:id', validateBody(createCardSchema), validateParams(cardIdSchema), updateCard);
router.delete('/:id', validateParams(cardIdSchema), deleteCard);
router.post('/:id/review', validateParams(cardIdSchema), reviewCard);

export default router;