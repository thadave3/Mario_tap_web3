import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertBidSchema,
  insertGameScoreSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });
  
  app.patch("/api/users/:id/coins", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    
    const coinsSchema = z.object({
      coins: z.number().int().min(0)
    });
    
    try {
      const { coins } = coinsSchema.parse(req.body);
      const user = await storage.updateUserCoins(id, coins);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid coins data" });
    }
  });
  
  app.patch("/api/users/:id/character", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    
    const characterSchema = z.object({
      character: z.string().min(1)
    });
    
    try {
      const { character } = characterSchema.parse(req.body);
      const user = await storage.updateUserCharacter(id, character);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid character data" });
    }
  });
  
  // Domain routes
  app.get("/api/domains", async (_req, res) => {
    const domains = await storage.getDomains();
    res.json(domains);
  });
  
  app.get("/api/domains/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    
    const domain = await storage.getDomain(id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }
    
    res.json(domain);
  });
  
  // Bid routes
  app.post("/api/bids", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse(req.body);
      
      // Check if domain exists
      const domain = await storage.getDomain(bidData.domainId);
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(bidData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if bid is higher than current bid
      if (bidData.bidAmount <= domain.currentBid) {
        return res.status(400).json({ message: "Bid must be higher than current bid" });
      }
      
      // Check if user has enough coins
      if (user.coins < bidData.bidAmount) {
        return res.status(400).json({ message: "Not enough coins" });
      }
      
      // Create bid
      const bid = await storage.createBid(bidData);
      
      // Update domain bid
      await storage.updateDomainBid(bidData.domainId, bidData.bidAmount, bidData.userId);
      
      // Update user coins
      await storage.updateUserCoins(bidData.userId, user.coins - bidData.bidAmount);
      
      res.status(201).json(bid);
    } catch (error) {
      res.status(400).json({ message: "Invalid bid data" });
    }
  });
  
  app.get("/api/domains/:domainId/bids", async (req, res) => {
    const domainId = parseInt(req.params.domainId);
    if (isNaN(domainId)) {
      return res.status(400).json({ message: "Invalid domain id" });
    }
    
    const bids = await storage.getBidsByDomain(domainId);
    res.json(bids);
  });
  
  // Game score routes
  app.post("/api/scores", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(scoreData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create score
      const score = await storage.createGameScore(scoreData);
      
      // Update user coins (reward based on score)
      const coinsEarned = Math.floor(scoreData.score / 10);
      await storage.updateUserCoins(scoreData.userId, user.coins + coinsEarned);
      
      res.status(201).json({ 
        ...score, 
        coinsEarned 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid score data" });
    }
  });
  
  app.get("/api/scores/top", async (_req, res) => {
    const scores = await storage.getTopGameScores(10);
    res.json(scores);
  });
  
  app.get("/api/users/:userId/scores", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    
    const scores = await storage.getUserGameScores(userId);
    res.json(scores);
  });
  
  // Reward routes
  app.get("/api/rewards", async (_req, res) => {
    const rewards = await storage.getRewards();
    res.json(rewards);
  });
  
  app.get("/api/rewards/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    
    const reward = await storage.getReward(id);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }
    
    res.json(reward);
  });
  
  app.post("/api/rewards/:id/redeem", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    
    const userIdSchema = z.object({
      userId: z.number().int().positive()
    });
    
    try {
      const { userId } = userIdSchema.parse(req.body);
      
      // Check if reward exists
      const reward = await storage.getReward(id);
      if (!reward) {
        return res.status(404).json({ message: "Reward not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has enough coins
      if (user.coins < reward.cost) {
        return res.status(400).json({ message: "Not enough coins" });
      }
      
      // Update user coins
      await storage.updateUserCoins(userId, user.coins - reward.cost);
      
      res.json({ message: "Reward redeemed successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid user id" });
    }
  });

  return httpServer;
}
