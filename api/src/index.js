import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import allMealsRouter from "./routers/allmeals.js";
import pastMealsRouter from "./routers/pastmeals.js";
import futureMealsRouter from "./routers/futuremeals.js";
import firstMealRouter from "./routers/firstmeal.js";
import lastMealRouter from "./routers/lastmeal.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

app.use("/allmeals", allMealsRouter);
app.use("/past-meals", pastMealsRouter);
app.use("/future-meals", futureMealsRouter);
app.use("/first-meal", firstMealRouter);
app.use("/last-meal", lastMealRouter);

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
