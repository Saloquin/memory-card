import express from "express"
import cors from "cors"
import authRoutes from "./routers/authRouter.js"
import logger from "./middleware/logger.js"
import collectionRoutes from "./routers/collectionRouter.js"

const PORT = 3000
const app = express();

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/auth',authRoutes)
app.use('/collections',collectionRoutes)

app.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
