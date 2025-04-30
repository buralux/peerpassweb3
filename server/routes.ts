import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { mintBusinessCardNFT } from "./smartContract";
import { prepareCardForMinting } from "./ipfsStorage";
import { createBusinessCardSchema, insertUserSchema, insertCollectedCardSchema, insertSocialAccountSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const user = await storage.getUserByWalletAddress(address);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Business Cards
  app.post("/api/cards", async (req, res) => {
    try {
      const data = createBusinessCardSchema.parse(req.body);
      const card = await storage.createBusinessCard(data);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create business card" });
      }
    }
  });

  app.get("/api/cards/owner/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const cards = await storage.getBusinessCardsByOwner(address);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get business cards" });
    }
  });

  app.get("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const card = await storage.getBusinessCard(id);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to get business card" });
    }
  });

  app.put("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = createBusinessCardSchema.partial().parse(req.body);
      const updatedCard = await storage.updateBusinessCard(id, updates);
      
      if (!updatedCard) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.json(updatedCard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update business card" });
      }
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBusinessCard(id);
      
      if (!success) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete business card" });
    }
  });

  // Mint a card as NFT
  app.post("/api/cards/:id/mint", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const card = await storage.getBusinessCard(id);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      if (card.isMinted) {
        return res.status(400).json({ message: "Card is already minted" });
      }
      
      // Prepare the card for minting
      const { ipfsHash, metadata } = await prepareCardForMinting(card);
      
      // Mint the NFT
      const tokenURI = `ipfs://${ipfsHash}`;
      const { tokenId, txHash } = await mintBusinessCardNFT(card.owner, tokenURI);
      
      // Update the card with the token info
      const updatedCard = await storage.updateBusinessCard(id, {
        tokenId,
        ipfsHash,
        isMinted: true,
        metadata,
      });
      
      res.json({
        card: updatedCard,
        tokenId,
        txHash,
        ipfsHash
      });
    } catch (error) {
      res.status(500).json({ message: `Failed to mint business card: ${(error as Error).message}` });
    }
  });

  // Collected Cards
  app.post("/api/collected-cards", async (req, res) => {
    try {
      const data = insertCollectedCardSchema.parse(req.body);
      const collectedCard = await storage.collectCard(data);
      res.status(201).json(collectedCard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to collect card" });
      }
    }
  });

  app.get("/api/collected-cards/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const cards = await storage.getCollectedCards(address);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collected cards" });
    }
  });

  // Social Accounts
  app.post("/api/social-accounts", async (req, res) => {
    try {
      const data = insertSocialAccountSchema.parse(req.body);
      const account = await storage.createSocialAccount(data);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create social account" });
      }
    }
  });

  app.get("/api/social-accounts/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const accounts = await storage.getSocialAccountsByUser(address);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get social accounts" });
    }
  });

  app.put("/api/social-accounts/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.verifySocialAccount(id);
      
      if (!account) {
        return res.status(404).json({ message: "Social account not found" });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify social account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
