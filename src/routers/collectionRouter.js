import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  getOneCollection,
  getPublicCollection,
  getUserCollection,
  updateCollection,
} from "../controllers/collectionController.js";
import checkToken from "../middleware/checkToken.js";
import {
  collectionIdSchema,
  collectionTitleSchema,
  createCollectionSchema,
  updateCollectionSchema,
} from "../models/collection.js";
import { validateBody, validateParams } from "../utils/validation.js";

const router = Router();

router.use(checkToken);

router.get("/user/", getUserCollection);
router.get(
  "/public/:title",
  validateParams(collectionTitleSchema),
  getPublicCollection
);
router.post("/", validateBody(createCollectionSchema), createCollection);
router.put(
  "/:id",
  validateBody(updateCollectionSchema),
  validateParams(collectionIdSchema),
  updateCollection
);
router.delete("/:id", validateParams(collectionIdSchema), deleteCollection);
router.get("/:id", validateParams(collectionIdSchema), getOneCollection);

export default router;
