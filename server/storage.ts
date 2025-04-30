import { 
  users, type User, type InsertUser,
  businessCards, type BusinessCard, type InsertBusinessCard,
  collectedCards, type CollectedCard, type InsertCollectedCard,
  socialAccounts, type SocialAccount, type InsertSocialAccount
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Business card operations
  getBusinessCard(id: number): Promise<BusinessCard | undefined>;
  getBusinessCardByTokenId(tokenId: string): Promise<BusinessCard | undefined>;
  getBusinessCardsByOwner(ownerAddress: string): Promise<BusinessCard[]>;
  createBusinessCard(card: InsertBusinessCard): Promise<BusinessCard>;
  updateBusinessCard(id: number, updates: Partial<BusinessCard>): Promise<BusinessCard | undefined>;
  deleteBusinessCard(id: number): Promise<boolean>;
  
  // Collected cards operations
  getCollectedCards(collectorAddress: string): Promise<BusinessCard[]>;
  collectCard(collectedCard: InsertCollectedCard): Promise<CollectedCard>;
  
  // Social accounts operations
  getSocialAccountsByUser(userAddress: string): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  verifySocialAccount(id: number): Promise<SocialAccount | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userByWallet: Map<string, User>;
  private businessCards: Map<number, BusinessCard>;
  private businessCardByToken: Map<string, BusinessCard>;
  private collectedCards: Map<number, CollectedCard>;
  private socialAccounts: Map<number, SocialAccount>;
  
  private userIdCounter: number;
  private cardIdCounter: number;
  private collectedCardIdCounter: number;
  private socialAccountIdCounter: number;

  constructor() {
    this.users = new Map();
    this.userByWallet = new Map();
    this.businessCards = new Map();
    this.businessCardByToken = new Map();
    this.collectedCards = new Map();
    this.socialAccounts = new Map();
    
    this.userIdCounter = 1;
    this.cardIdCounter = 1;
    this.collectedCardIdCounter = 1;
    this.socialAccountIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return this.userByWallet.get(walletAddress.toLowerCase());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const lowercaseWallet = insertUser.walletAddress.toLowerCase();
    
    const user: User = { 
      ...insertUser, 
      id, 
      walletAddress: lowercaseWallet,
      createdAt: now
    };
    
    this.users.set(id, user);
    this.userByWallet.set(lowercaseWallet, user);
    return user;
  }

  // Business card operations
  async getBusinessCard(id: number): Promise<BusinessCard | undefined> {
    return this.businessCards.get(id);
  }

  async getBusinessCardByTokenId(tokenId: string): Promise<BusinessCard | undefined> {
    return this.businessCardByToken.get(tokenId);
  }

  async getBusinessCardsByOwner(ownerAddress: string): Promise<BusinessCard[]> {
    const lowercaseOwner = ownerAddress.toLowerCase();
    return Array.from(this.businessCards.values()).filter(
      card => card.owner.toLowerCase() === lowercaseOwner
    );
  }

  async createBusinessCard(insertCard: InsertBusinessCard): Promise<BusinessCard> {
    const id = this.cardIdCounter++;
    const now = new Date();
    const lowercaseOwner = insertCard.owner.toLowerCase();
    
    const card: BusinessCard = {
      ...insertCard,
      id,
      owner: lowercaseOwner,
      tokenId: null,
      ipfsHash: null,
      isMinted: false,
      createdAt: now,
      updatedAt: now
    };
    
    this.businessCards.set(id, card);
    return card;
  }

  async updateBusinessCard(id: number, updates: Partial<BusinessCard>): Promise<BusinessCard | undefined> {
    const card = this.businessCards.get(id);
    if (!card) return undefined;
    
    const updatedCard: BusinessCard = {
      ...card,
      ...updates,
      updatedAt: new Date()
    };
    
    this.businessCards.set(id, updatedCard);
    
    // Update token mapping if tokenId is updated
    if (updates.tokenId && updates.tokenId !== card.tokenId) {
      if (card.tokenId) {
        this.businessCardByToken.delete(card.tokenId);
      }
      this.businessCardByToken.set(updates.tokenId, updatedCard);
    }
    
    return updatedCard;
  }

  async deleteBusinessCard(id: number): Promise<boolean> {
    const card = this.businessCards.get(id);
    if (!card) return false;
    
    this.businessCards.delete(id);
    if (card.tokenId) {
      this.businessCardByToken.delete(card.tokenId);
    }
    
    return true;
  }

  // Collected cards operations
  async getCollectedCards(collectorAddress: string): Promise<BusinessCard[]> {
    const lowercaseCollector = collectorAddress.toLowerCase();
    
    // Get all collected cards by this collector
    const collectedCardIds = Array.from(this.collectedCards.values())
      .filter(cc => cc.collectorAddress.toLowerCase() === lowercaseCollector)
      .map(cc => cc.cardId);
    
    // Get the business cards for these IDs
    return Array.from(this.businessCards.values())
      .filter(card => collectedCardIds.includes(card.id));
  }

  async collectCard(insertCollectedCard: InsertCollectedCard): Promise<CollectedCard> {
    const id = this.collectedCardIdCounter++;
    const lowercaseCollector = insertCollectedCard.collectorAddress.toLowerCase();
    
    const collectedCard: CollectedCard = {
      ...insertCollectedCard,
      id,
      collectorAddress: lowercaseCollector,
      collectedAt: new Date()
    };
    
    this.collectedCards.set(id, collectedCard);
    return collectedCard;
  }

  // Social accounts operations
  async getSocialAccountsByUser(userAddress: string): Promise<SocialAccount[]> {
    const lowercaseAddress = userAddress.toLowerCase();
    
    return Array.from(this.socialAccounts.values())
      .filter(account => account.userAddress.toLowerCase() === lowercaseAddress);
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.socialAccountIdCounter++;
    const lowercaseAddress = insertAccount.userAddress.toLowerCase();
    
    const socialAccount: SocialAccount = {
      ...insertAccount,
      id,
      userAddress: lowercaseAddress,
      verified: false,
      verifiedAt: null
    };
    
    this.socialAccounts.set(id, socialAccount);
    return socialAccount;
  }

  async verifySocialAccount(id: number): Promise<SocialAccount | undefined> {
    const account = this.socialAccounts.get(id);
    if (!account) return undefined;
    
    const now = new Date();
    const verifiedAccount: SocialAccount = {
      ...account,
      verified: true,
      verifiedAt: now
    };
    
    this.socialAccounts.set(id, verifiedAccount);
    return verifiedAccount;
  }
}

export const storage = new MemStorage();
