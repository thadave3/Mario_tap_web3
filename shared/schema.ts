import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  coins: integer("coins").default(0).notNull(),
  character: text("character").default("mario").notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  socialLinks: jsonb("social_links").$type<{facebook?: string, tiktok?: string, discord?: string}>(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Domain model
export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  price: integer("price").notNull(),
  currentBid: integer("current_bid").default(0),
  timeLeft: integer("time_left").notNull(),
  bidCount: integer("bid_count").default(0),
  ownerId: integer("owner_id").references(() => users.id),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Bids model
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull().references(() => domains.id),
  userId: integer("user_id").notNull().references(() => users.id),
  bidAmount: integer("bid_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Game scores model
export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Rewards model
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  coins: true,
  level: true,
  experience: true,
  createdAt: true
});

export const insertDomainSchema = createInsertSchema(domains).omit({
  id: true, 
  currentBid: true,
  bidCount: true,
  createdAt: true
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  createdAt: true
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  createdAt: true
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Domain = typeof domains.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
