import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  walletAddress: true,
  avatarUrl: true,
});

export const businessCards = pgTable("business_cards", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id"),
  owner: text("owner").notNull(), // wallet address
  name: text("name").notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company"),
  bio: text("bio"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  template: text("template").notNull(),
  colorScheme: text("color_scheme").notNull(),
  avatarUrl: text("avatar_url"),
  socialLinks: jsonb("social_links").notNull().default({}),
  metadata: jsonb("metadata").notNull().default({}),
  ipfsHash: text("ipfs_hash"),
  isMinted: boolean("is_minted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBusinessCardSchema = createInsertSchema(businessCards).omit({
  id: true,
  tokenId: true,
  ipfsHash: true,
  isMinted: true,
  createdAt: true,
  updatedAt: true,
});

export const collectedCards = pgTable("collected_cards", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull(),
  collectorAddress: text("collector_address").notNull(),
  collectedAt: timestamp("collected_at").defaultNow(),
});

export const insertCollectedCardSchema = createInsertSchema(collectedCards).omit({
  id: true,
  collectedAt: true,
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userAddress: text("user_address").notNull(),
  platform: text("platform").notNull(), // 'facebook', 'twitter', 'linkedin', etc.
  username: text("username").notNull(),
  verified: boolean("verified").notNull().default(false),
  profileUrl: text("profile_url"),
  verifiedAt: timestamp("verified_at"),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  verified: true,
  verifiedAt: true,
});

// Template options
export const cardTemplates = [
  "professional", // blue gradient
  "creative",     // teal gradient
  "bold",         // amber gradient
  "modern",       // purple gradient
  "minimal",      // gray gradient
  "omari",        // gold/black gradient
] as const;

export const colorSchemes = [
  "blue-violet", // blue to violet gradient
  "teal-emerald", // teal to emerald gradient
  "amber-red", // amber to red gradient
  "purple-pink", // purple to pink gradient
  "gray-dark", // gray to dark gradient
  "gold-black", // gold to black gradient (style Omari)
  "custom", // custom color scheme
] as const;

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BusinessCard = typeof businessCards.$inferSelect;
export type InsertBusinessCard = z.infer<typeof insertBusinessCardSchema>;

export type CollectedCard = typeof collectedCards.$inferSelect;
export type InsertCollectedCard = z.infer<typeof insertCollectedCardSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type CardTemplate = typeof cardTemplates[number];
export type ColorScheme = typeof colorSchemes[number];

// Extended validation schema for business card creation
export const createBusinessCardSchema = insertBusinessCardSchema.extend({
  template: z.enum(cardTemplates),
  colorScheme: z.enum(colorSchemes),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  socialLinks: z.record(z.string(), z.string().url()).optional().or(z.literal({})),
});
