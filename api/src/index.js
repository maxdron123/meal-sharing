import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mealsRouter } from "./routers/meals.js";
import { reservationsRouter } from "./routers/reservations.js";
import { reviewsRouter } from "./routers/reviews.js";
import { usersRouter } from "./routers/users.js";

const app = express();

// Configure CORS for production
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://dist-0jkg.onrender.com", // Your frontend Render URL
    "https://meal-sharing-api-wpfg.onrender.com", // Your API Render URL
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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
