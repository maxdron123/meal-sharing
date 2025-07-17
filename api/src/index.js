import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mealsRouter } from "./routers/meals.js";
import { reservationsRouter } from "./routers/reservations.js";
import { reviewsRouter } from "./routers/reviews.js";
import { usersRouter } from "./routers/users.js";

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const apiRouter = express.Router();

apiRouter.use("/meals", mealsRouter);
apiRouter.use("/reservations", reservationsRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
