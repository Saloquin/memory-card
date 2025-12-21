import cors from "cors";
import express from "express";
import authRoutes from "./routers/authRouter.js";
import cardRoutes from "./routers/cardRouter.js";
import collectionRoutes from "./routers/collectionRouter.js";
import reviewRoutes from "./routers/reviewRouter.js";
import userRoutes from "./routers/userRouter.js";
import logger from "./utils/logger.js";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/auth", authRoutes);
app.use("/collections", collectionRoutes);
app.use("/cards", cardRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoutes);

app.listen(PORT, "localhost", () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
