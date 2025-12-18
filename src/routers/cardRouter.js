import { Router } from "express";
import { 
    getOneCard,
    getCardsByCollection,
    createCard,
    updateCard,
    deleteCard
} from "../controllers/cardController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { createCardSchema, cardIdSchema, updateCardSchema } from "../models/card.js";
import { collectionIdSchema } from "../models/collection.js";
import checkToken from "../middleware/checkToken.js";

const router = Router();

router.use(checkToken);
router.post('/', validateBody(createCardSchema), createCard);
router.get('/:id', validateParams(cardIdSchema), getOneCard);
router.get('/collection/:id', validateParams(collectionIdSchema), getCardsByCollection);
router.put('/:id', validateBody(updateCardSchema), validateParams(cardIdSchema), updateCard);
router.delete('/:id', validateParams(cardIdSchema), deleteCard);

export default router;