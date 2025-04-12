import { 
  users, domains, bids, gameScores, rewards,
  type User, type InsertUser,
  type Domain, type InsertDomain,
  type Bid, type InsertBid,
  type GameScore, type InsertGameScore,
  type Reward, type InsertReward
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(id: number, coins: number): Promise<User | undefined>;
  updateUserCharacter(id: number, character: string): Promise<User | undefined>;
  
  // Domain methods
  getDomains(): Promise<Domain[]>;
  getDomain(id: number): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomainBid(id: number, bid: number, userId: number): Promise<Domain | undefined>;
  
  // Bid methods
  createBid(bid: InsertBid): Promise<Bid>;
  getBidsByDomain(domainId: number): Promise<Bid[]>;
  
  // Game score methods
  getTopGameScores(limit: number): Promise<GameScore[]>;
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getUserGameScores(userId: number): Promise<GameScore[]>;
  
  // Reward methods
  getRewards(): Promise<Reward[]>;
  getReward(id: number): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private domains: Map<number, Domain>;
  private bids: Map<number, Bid>;
  private gameScores: Map<number, GameScore>;
  private rewards: Map<number, Reward>;
  
  private userIdCounter: number;
  private domainIdCounter: number;
  private bidIdCounter: number;
  private gameScoreIdCounter: number;
  private rewardIdCounter: number;

  constructor() {
    this.users = new Map();
    this.domains = new Map();
    this.bids = new Map();
    this.gameScores = new Map();
    this.rewards = new Map();
    
    this.userIdCounter = 1;
    this.domainIdCounter = 1;
    this.bidIdCounter = 1;
    this.gameScoreIdCounter = 1;
    this.rewardIdCounter = 1;
    
    // Initialize with some sample domains
    this.initializeData();
  }
  
  private initializeData() {
    // Create some initial domains
    const domains: InsertDomain[] = [
      {
        name: "crypto-world.nft",
        price: 250,
        timeLeft: 45930, // 12:45:30 in seconds
        description: "A premium domain for crypto enthusiasts with unlimited subdomains!"
      },
      {
        name: "game-masters.eth",
        price: 375,
        timeLeft: 30235, // 08:23:55 in seconds
        description: "Premium gaming domain with subdomain potential for all gamers!"
      },
      {
        name: "pixel-kingdom.chain",
        price: 150,
        timeLeft: 86399, // 23:59:59 in seconds
        description: "Perfect for pixel art enthusiasts and retro gaming communities!"
      }
    ];
    
    // Create some initial rewards
    const rewards: InsertReward[] = [
      {
        name: "Movie Ticket",
        description: "Get a free movie ticket at participating theaters",
        cost: 100,
        category: "entertainment"
      },
      {
        name: "Premium Seat",
        description: "Upgrade to a premium seat at participating theaters",
        cost: 150,
        category: "entertainment"
      },
      {
        name: "Concession Deal",
        description: "Get a discount on concessions at participating theaters",
        cost: 75,
        category: "entertainment"
      },
      {
        name: "Facebook Boost",
        description: "Boost your Facebook post to reach more people",
        cost: 120,
        category: "social"
      },
      {
        name: "TikTok Promotion",
        description: "Promote your TikTok video to reach more people",
        cost: 200,
        category: "social"
      },
      {
        name: "Exclusive Filter",
        description: "Get access to exclusive social media filters",
        cost: 80,
        category: "social"
      },
      {
        name: "Common Character NFT",
        description: "Get a common character NFT to use in games",
        cost: 250,
        category: "nft"
      },
      {
        name: "Rare Power-up NFT",
        description: "Get a rare power-up NFT to use in games",
        cost: 500,
        category: "nft"
      },
      {
        name: "Legendary Item NFT",
        description: "Get a legendary item NFT to use in games",
        cost: 1000,
        category: "nft"
      }
    ];
    
    // Add domains to storage
    domains.forEach(domain => this.createDomain(domain));
    
    // Add rewards to storage
    rewards.forEach(reward => this.createReward(reward));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      coins: 100, // Start with 100 coins
      level: 1,
      experience: 0,
      socialLinks: {},
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserCoins(id: number, coins: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, coins };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserCharacter(id: number, character: string): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, character };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Domain methods
  async getDomains(): Promise<Domain[]> {
    return Array.from(this.domains.values());
  }
  
  async getDomain(id: number): Promise<Domain | undefined> {
    return this.domains.get(id);
  }
  
  async createDomain(insertDomain: InsertDomain): Promise<Domain> {
    const id = this.domainIdCounter++;
    const now = new Date();
    const domain: Domain = {
      ...insertDomain,
      id,
      currentBid: 0,
      bidCount: 0,
      ownerId: null,
      createdAt: now
    };
    this.domains.set(id, domain);
    return domain;
  }
  
  async updateDomainBid(id: number, bidAmount: number, userId: number): Promise<Domain | undefined> {
    const domain = await this.getDomain(id);
    if (!domain) return undefined;
    
    const updatedDomain = { 
      ...domain, 
      currentBid: bidAmount, 
      bidCount: domain.bidCount + 1,
      ownerId: userId
    };
    this.domains.set(id, updatedDomain);
    return updatedDomain;
  }
  
  // Bid methods
  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = this.bidIdCounter++;
    const now = new Date();
    const bid: Bid = {
      ...insertBid,
      id,
      createdAt: now
    };
    this.bids.set(id, bid);
    return bid;
  }
  
  async getBidsByDomain(domainId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => bid.domainId === domainId);
  }
  
  // Game score methods
  async getTopGameScores(limit: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  async createGameScore(insertGameScore: InsertGameScore): Promise<GameScore> {
    const id = this.gameScoreIdCounter++;
    const now = new Date();
    const gameScore: GameScore = {
      ...insertGameScore,
      id,
      createdAt: now
    };
    this.gameScores.set(id, gameScore);
    return gameScore;
  }
  
  async getUserGameScores(userId: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(score => score.userId === userId)
      .sort((a, b) => b.score - a.score);
  }
  
  // Reward methods
  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }
  
  async getReward(id: number): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }
  
  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = this.rewardIdCounter++;
    const now = new Date();
    const reward: Reward = {
      ...insertReward,
      id,
      createdAt: now
    };
    this.rewards.set(id, reward);
    return reward;
  }
}

export const storage = new MemStorage();
