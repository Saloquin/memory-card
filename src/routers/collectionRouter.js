import { Router } from "express";
import { getOneCollection,getUserCollection,getPublicCollection,createCollection,updateCollection,deleteCollection} from "../controllers/collectionController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { createCollectionSchema, collectionIdSchema } from "../models/collection.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()

router.use(checkToken)

router.get('/user/', getUserCollection)
router.get('/public/', getPublicCollection)
router.post('/', validateBody(createCollectionSchema), createCollection)
router.put('/:id', validateBody(createCollectionSchema),validateParams(collectionIdSchema), updateCollection)
router.delete('/:id', validateParams(collectionIdSchema), deleteCollection)
router.get('/:id', validateParams(collectionIdSchema), getOneCollection)

export default router