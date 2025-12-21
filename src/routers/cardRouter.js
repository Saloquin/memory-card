import { Router } from "express";
import {
  createCard,
  deleteCard,
  getCardsByCollection,
  getOneCard,
  updateCard,
} from "../controllers/cardController.js";
import checkToken from "../middleware/checkToken.js";
import {
  cardIdSchema,
  createCardSchema,
  updateCardSchema,
} from "../models/card.js";
import { collectionIdSchema } from "../models/collection.js";
import { validateBody, validateParams } from "../utils/validation.js";

const router = Router();

router.use(checkToken);
router.post("/", validateBody(createCardSchema), createCard);
router.get("/:id", validateParams(cardIdSchema), getOneCard);
router.get(
  "/collection/:id",
  validateParams(collectionIdSchema),
  getCardsByCollection
);
router.put(
  "/:id",
  validateBody(updateCardSchema),
  validateParams(cardIdSchema),
  updateCard
);
router.delete("/:id", validateParams(cardIdSchema), deleteCard);

export default router;
