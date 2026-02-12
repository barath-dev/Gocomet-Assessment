import 'newrelic';

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import prisma from './utils/prismaClient';
import { leaderBoardRoutes } from "./routes/leaderboard.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use(limiter);

app.get("/", (req, res) => {
  res.send("Gaming Leaderboard API is Alive");
});

app.use("/api/leaderboard", leaderBoardRoutes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();
