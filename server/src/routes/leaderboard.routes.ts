import { Router } from "express";
import { getRank, getTop10, submitScore } from "../controllers/leaderboard.controller";

const router  = Router();


router.get("/top",getTop10);

router.post("/submit",submitScore);

router.get("/rank/:userId",getRank);

export const leaderBoardRoutes = router;