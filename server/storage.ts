import { users, cruises, bookings, type User, type InsertUser, type Cruise, type InsertCruise, type Booking, type InsertBooking, type CreateBookingInput } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Cruise operations
  getCruise(id: number): Promise<Cruise | undefined>;
  getAllCruises(): Promise<Cruise[]>;
  createCruise(cruise: InsertCruise): Promise<Cruise>;
  updateCruise(id: number, cruise: InsertCruise): Promise<Cruise | undefined>;
  deleteCruise(id: number): Promise<boolean>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  calculateBookingPrice(bookingData: CreateBookingInput): Promise<{
    totalPrice: number;
    breakdown: {
      basePrice: number;
      cabinUpgrade: number;
      taxesFees: number;
      gratuities: number;
    };
  }>;
  
  // Session store
  sessionStore: session.Store;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cruises: Map<number, Cruise>;
  private bookings: Map<number, Booking>;
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private cruiseIdCounter: number;
  private bookingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.cruises = new Map();
    this.bookings = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.userIdCounter = 1;
    this.cruiseIdCounter = 1;
    this.bookingIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create admin user
    await this.createUser({
      username: "admin",
      email: "admin@cruises.com",
      password: "$2b$10$X4kv7j5ZcG39WgogSl16beuL8dS.ioNGJs1L2Y8oHT5npk3uYXIry", // "password123"
      firstName: "Admin",
      lastName: "User",
      phoneNumber: "123-456-7890",
      isAdmin: true,
      profilePicture: ""
    });
    
    // Create regular user
    await this.createUser({
      username: "customer",
      email: "customer@example.com",
      password: "$2b$10$X4kv7j5ZcG39WgogSl16beuL8dS.ioNGJs1L2Y8oHT5npk3uYXIry", // "password123"
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-123-4567",
      isAdmin: false,
      profilePicture: ""
    });
    
    // Create sample cruises
    await this.createCruise({
      name: "Caribbean Paradise",
      description: "Enjoy crystal clear waters, white sand beaches, and luxurious accommodations on this unforgettable Caribbean adventure.",
      departureLocation: "Miami",
      destinationLocation: "Bahamas",
      duration: 7,
      basePrice: 1299,
      taxesFees: 199,
      gratuities: 101,
      image: "https://images.unsplash.com/photo-1580541631971-c7f8c0f8e414",
      rating: 4.5,
      reviewCount: 128,
      isActive: true,
      departureOptions: ["2025-06-15", "2025-07-05", "2025-07-25", "2025-08-15"]
    });
    
    await this.createCruise({
      name: "Mediterranean Explorer",
      description: "Discover the rich history, culture, and cuisine of the Mediterranean with stops in Spain, France, and Italy.",
      departureLocation: "Barcelona",
      destinationLocation: "Rome",
      duration: 10,
      basePrice: 2199,
      taxesFees: 299,
      gratuities: 150,
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      rating: 5,
      reviewCount: 97,
      isActive: true,
      departureOptions: ["2025-05-22", "2025-06-12", "2025-07-02", "2025-08-22"]
    });
    
    await this.createCruise({
      name: "Alaskan Adventure",
      description: "Experience the majestic glaciers, wildlife, and breathtaking landscapes of Alaska on this unforgettable journey.",
      departureLocation: "Seattle",
      destinationLocation: "Juneau",
      duration: 12,
      basePrice: 1899,
      taxesFees: 249,
      gratuities: 144,
      image: "https://images.unsplash.com/photo-1579656450812-5b1da79e7cc3",
      rating: 4.8,
      reviewCount: 86,
      isActive: true,
      departureOptions: ["2025-05-10", "2025-06-05", "2025-07-15", "2025-08-10"]
    });
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = {
      id,
      ...userData,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // CRUISE METHODS
  async getCruise(id: number): Promise<Cruise | undefined> {
    return this.cruises.get(id);
  }

  async getAllCruises(): Promise<Cruise[]> {
    return Array.from(this.cruises.values());
  }

  async createCruise(cruiseData: InsertCruise): Promise<Cruise> {
    const id = this.cruiseIdCounter++;
    const now = new Date();
    
    const cruise: Cruise = {
      id,
      ...cruiseData,
      createdAt: now
    };
    
    this.cruises.set(id, cruise);
    return cruise;
  }
  
  async updateCruise(id: number, cruiseData: InsertCruise): Promise<Cruise | undefined> {
    const existingCruise = this.cruises.get(id);
    if (!existingCruise) {
      return undefined;
    }
    
    const updatedCruise: Cruise = {
      ...existingCruise,
      ...cruiseData
    };
    
    this.cruises.set(id, updatedCruise);
    return updatedCruise;
  }
  
  async deleteCruise(id: number): Promise<boolean> {
    return this.cruises.delete(id);
  }

  // BOOKING METHODS
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }
  
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    
    let departureDate: Date;
    if (typeof bookingData.departureDate === 'string') {
      departureDate = new Date(bookingData.departureDate);
    } else {
      departureDate = bookingData.departureDate;
    }
    
    const booking: Booking = {
      id,
      ...bookingData,
      departureDate,
      createdAt: now,
      updatedAt: now
    };
    
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) {
      return undefined;
    }
    
    const updatedBooking: Booking = {
      ...booking,
      status,
      updatedAt: new Date()
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  async calculateBookingPrice(bookingData: CreateBookingInput): Promise<{
    totalPrice: number;
    breakdown: {
      basePrice: number;
      cabinUpgrade: number;
      taxesFees: number;
      gratuities: number;
    };
  }> {
    const cruise = await this.getCruise(bookingData.cruiseId);
    if (!cruise) {
      throw new Error("Cruise not found");
    }
    
    // Base price calculation
    const basePrice = cruise.basePrice * bookingData.adults + (cruise.basePrice * 0.75 * bookingData.children);
    
    // Cabin type price adjustments
    let cabinMultiplier = 1;
    switch (bookingData.cabinType) {
      case "interior":
        cabinMultiplier = 1;
        break;
      case "oceanview":
        cabinMultiplier = 1.3;
        break;
      case "balcony":
        cabinMultiplier = 1.6;
        break;
      case "suite":
        cabinMultiplier = 2.2;
        break;
    }
    
    const cabinPrice = basePrice * cabinMultiplier;
    const cabinUpgrade = cabinPrice - basePrice;
    
    // Taxes and fees
    const taxesFees = cruise.taxesFees * (bookingData.adults + bookingData.children);
    
    // Gratuities
    const gratuities = cruise.gratuities * (bookingData.adults + bookingData.children * 0.5);
    
    // Total price
    const totalPrice = cabinPrice + taxesFees + gratuities;
    
    return {
      totalPrice,
      breakdown: {
        basePrice,
        cabinUpgrade,
        taxesFees,
        gratuities
      }
    };
  }
}

export const storage = new MemStorage();
