import { 
  users, type User, type InsertUser,
  businessCards, type BusinessCard, type InsertBusinessCard,
  collectedCards, type CollectedCard, type InsertCollectedCard,
  socialAccounts, type SocialAccount, type InsertSocialAccount
} from "@shared/schema";
import { eq } from "drizzle-orm";

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
    
    // Initialize demo data
    this.initializeDemoData();
  }
  
  // Initialize demo data for testing
  private initializeDemoData() {
    // Demo users
    const demoUser1: User = {
      id: this.userIdCounter++,
      walletAddress: "0xDemoAddress1",
      name: "Demo User",
      email: "demo@example.com",
      createdAt: new Date()
    };
    this.users.set(demoUser1.id, demoUser1);
    this.userByWallet.set(demoUser1.walletAddress.toLowerCase(), demoUser1);
    
    // Demo cards
    const azizCard: BusinessCard = {
      id: 2,
      owner: "0xDemoAddress1",
      tokenId: "demo-token-2",
      name: "AZIZ LAGHZAOUI",
      jobTitle: "Chairman",
      company: "Concept4.crypto",
      email: "aziz.laghzaoui@concept4.crypto",
      phone: "+212 687654321",
      website: "concept4.crypto",
      bio: "Leader dans l'innovation blockchain et la finance décentralisée. Pionnier des solutions crypto pour les entreprises.",
      template: "modern",
      colorScheme: "purple-pink",
      avatarUrl: null,
      socialLinks: {
        twitter: "https://twitter.com/azizlaghzaoui",
        linkedin: "https://linkedin.com/in/azizlaghzaoui"
      },
      metadata: {},
      customization: {},
      ipfsHash: null,
      isMinted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const aliCard: BusinessCard = {
      id: 1,
      owner: "0xDemoAddress1",
      tokenId: "demo-token-1",
      name: "ALI HAMAYET",
      jobTitle: "Blockchain Expert",
      company: "BChain Solutions",
      email: "ali.hamayet@bchain.com",
      phone: "+212 612345678",
      website: "bchain.solutions",
      bio: "Expert en blockchain et technologies Web3 avec plus de 8 ans d'expérience. Spécialisé dans l'implémentation de solutions décentralisées.",
      template: "professional",
      colorScheme: "blue-violet",
      avatarUrl: null,
      socialLinks: {
        linkedin: "https://linkedin.com/in/ali-hamayet",
        twitter: "https://twitter.com/alihamayet"
      },
      metadata: {},
      customization: {},
      ipfsHash: null,
      isMinted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const mohamedCard: BusinessCard = {
      id: 4,
      owner: "0xDemoAddress1",
      tokenId: "demo-token-4",
      name: "MOHAMED AZIZI",
      jobTitle: "PURCHASE MANAGER",
      company: "Omari Construction",
      email: "mohamed@omari-construction.ma",
      phone: "+212 661 23 45 67",
      website: "https://omari-construction.ma",
      bio: "Responsable des achats et de l'approvisionnement avec plus de 15 ans d'expérience dans le secteur de la construction.",
      template: "omari",
      colorScheme: "gold-black",
      avatarUrl: null,
      socialLinks: {
        linkedin: "https://linkedin.com/in/mohamed-azizi",
        twitter: "https://twitter.com/omari_construction"
      },
      metadata: {},
      customization: {
        fontFamily: 'Poppins',
        fontWeight: 'bold'
      },
      ipfsHash: null,
      isMinted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Add cards to storage
    this.businessCards.set(azizCard.id, azizCard);
    this.businessCardByToken.set(azizCard.tokenId, azizCard);
    
    this.businessCards.set(aliCard.id, aliCard);
    this.businessCardByToken.set(aliCard.tokenId, aliCard);
    
    this.businessCards.set(mohamedCard.id, mohamedCard);
    this.businessCardByToken.set(mohamedCard.tokenId, mohamedCard);
    
    // Update counters
    this.cardIdCounter = 5; // After the highest ID
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { db } = await import('./db');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const { db } = await import('./db');
    const lowercaseWallet = walletAddress.toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.walletAddress, lowercaseWallet));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { db } = await import('./db');
    const lowercaseWallet = insertUser.walletAddress.toLowerCase();
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        walletAddress: lowercaseWallet
      })
      .returning();
    return user;
  }

  async getBusinessCard(id: number): Promise<BusinessCard | undefined> {
    const { db } = await import('./db');
    const [card] = await db.select().from(businessCards).where(eq(businessCards.id, id));
    return card;
  }

  async getBusinessCardByTokenId(tokenId: string): Promise<BusinessCard | undefined> {
    const { db } = await import('./db');
    const [card] = await db.select().from(businessCards).where(eq(businessCards.tokenId, tokenId));
    return card;
  }

  async getBusinessCardsByOwner(ownerAddress: string): Promise<BusinessCard[]> {
    const { db } = await import('./db');
    const lowercaseOwner = ownerAddress.toLowerCase();
    return await db.select().from(businessCards).where(eq(businessCards.owner, lowercaseOwner));
  }

  async createBusinessCard(insertCard: InsertBusinessCard): Promise<BusinessCard> {
    const { db } = await import('./db');
    const lowercaseOwner = insertCard.owner.toLowerCase();
    const [card] = await db
      .insert(businessCards)
      .values({
        ...insertCard,
        owner: lowercaseOwner,
        tokenId: null,
        ipfsHash: null,
        isMinted: false
      })
      .returning();
    return card;
  }

  async updateBusinessCard(id: number, updates: Partial<BusinessCard>): Promise<BusinessCard | undefined> {
    const { db } = await import('./db');
    
    // Get the current card to make sure it exists
    const [existingCard] = await db.select().from(businessCards).where(eq(businessCards.id, id));
    if (!existingCard) return undefined;
    
    // Update with new values
    const [updatedCard] = await db
      .update(businessCards)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(businessCards.id, id))
      .returning();
    
    return updatedCard;
  }

  async deleteBusinessCard(id: number): Promise<boolean> {
    const { db } = await import('./db');
    
    // Get the current card to make sure it exists
    const [existingCard] = await db.select().from(businessCards).where(eq(businessCards.id, id));
    if (!existingCard) return false;
    
    // Delete the card
    await db.delete(businessCards).where(eq(businessCards.id, id));
    
    return true;
  }

  async getCollectedCards(collectorAddress: string): Promise<BusinessCard[]> {
    const { db } = await import('./db');
    const lowercaseCollector = collectorAddress.toLowerCase();
    
    // Join collected_cards with business_cards to get the full card details
    return await db
      .select({
        businessCard: businessCards
      })
      .from(collectedCards)
      .innerJoin(businessCards, eq(collectedCards.cardId, businessCards.id))
      .where(eq(collectedCards.collectorAddress, lowercaseCollector))
      .then(result => result.map(r => r.businessCard));
  }

  async collectCard(insertCollectedCard: InsertCollectedCard): Promise<CollectedCard> {
    const { db } = await import('./db');
    const lowercaseCollector = insertCollectedCard.collectorAddress.toLowerCase();
    const [collectedCard] = await db
      .insert(collectedCards)
      .values({
        ...insertCollectedCard,
        collectorAddress: lowercaseCollector
      })
      .returning();
    return collectedCard;
  }

  async getSocialAccountsByUser(userAddress: string): Promise<SocialAccount[]> {
    const { db } = await import('./db');
    const lowercaseAddress = userAddress.toLowerCase();
    return await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.userAddress, lowercaseAddress));
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const { db } = await import('./db');
    const lowercaseAddress = insertAccount.userAddress.toLowerCase();
    const [socialAccount] = await db
      .insert(socialAccounts)
      .values({
        ...insertAccount,
        userAddress: lowercaseAddress
      })
      .returning();
    return socialAccount;
  }

  async verifySocialAccount(id: number): Promise<SocialAccount | undefined> {
    const { db } = await import('./db');
    
    // Get the current account to make sure it exists
    const [existingAccount] = await db.select().from(socialAccounts).where(eq(socialAccounts.id, id));
    if (!existingAccount) return undefined;
    
    // Update with verification
    const [verifiedAccount] = await db
      .update(socialAccounts)
      .set({
        verified: true,
        verifiedAt: new Date()
      })
      .where(eq(socialAccounts.id, id))
      .returning();
    
    return verifiedAccount;
  }
}

// Utiliser DatabaseStorage au lieu de MemStorage
export const storage = new DatabaseStorage();
