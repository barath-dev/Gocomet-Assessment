import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import redisClient from "../utils/redisClient";
import prisma from "../utils/prismaClient";


export const submitScore = asyncHandler(async (req:Request, res:Response) => {
  try {
    const {userId, score} = req.body;

    if(!userId || score === undefined){
      return res.status(400).json({ error: "Invalid request body" });
    }

    const result = await prisma.$transaction(async(tx)=>{

      const newSession =  await tx.gameSession.create({
        data:{userId: parseInt(userId),
        score: parseInt(score),
        gameMode: "solo"
        }
      });

     const leaderboardEntry = await tx.leaderboard.upsert({
       where: {userId:userId},
        update:{
          totalScore:{
           increment:parseInt(score)
         }
       },
        create:{
          userId:userId,
          totalScore:parseInt(score),
         rank:0
       } 
      });
      return {session: newSession, leaderboard: leaderboardEntry};
    });

    redisClient.del("leaderboard:top10");

    res.status(201).json({
      message: "Score submitted successfully",
      data: result
    });

    } catch (error) {
      console.log("Submit Score Error", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export const getTop10 = asyncHandler(async (req:Request, res:Response) => {
  try {
    const CACHE_KEY = "leaderboeard:top10";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (typeof cachedData === "string") {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const topPlayers = await prisma.leaderboard.findMany({
      take:10,
      orderBy:{
        totalScore:"desc"
      },
      include:{
        user:{
          select:{
            username: true
          }
        }
      }
    });

    await redisClient.setEx(CACHE_KEY,15,JSON.stringify(topPlayers));

    res.status(200).json(topPlayers);

  } catch (error) {
    console.log("Top10 Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const getRank = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = parseInt(Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId, 10);

    const userEntry = await prisma.leaderboard.findUnique({
      where: { userId: userId },
      select: { totalScore: true, user: { select: { username: true } } }
    });

    if (!userEntry) {
      return res.status(404).json({ error: "User not found in leaderboard" });
    }

    const higherCount = await prisma.leaderboard.count({
      where: {
        totalScore: { gt: userEntry.totalScore }
      }
    });

    const rank = higherCount + 1;

    res.json({
      userId,
      username: userEntry.user.username,
      totalScore: userEntry.totalScore,
      rank
    });
  } catch (error) {
    console.log("Rank Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});