import { Router } from "express";
import {
  getCardsToReview,
  reviewCard,
} from "../controllers/reviewController.js";
import checkToken from "../middleware/checkToken.js";
import { cardIdSchema } from "../models/card.js";
import { collectionIdSchema } from "../models/collection.js";
import { updateReviewSchema } from "../models/review.js";
import { validateBody, validateParams } from "../utils/validation.js";

const router = Router();

router.use(checkToken);

router.get(
  "/collection/:id/review",
  validateParams(collectionIdSchema),
  getCardsToReview
);
router.post(
  "/:id/review",
  validateBody(updateReviewSchema),
  validateParams(cardIdSchema),
  reviewCard
);

export default router;
