import { users, cruises, bookings } from "./shared/schema";
import session from "express-session";
import createMemoryStore from "./memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, desc, and } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

class MemStorage {
  constructor() {
    this.users = new Map();
    this.cruises = new Map();
    this.bookings = new Map();

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });

    this.userIdCounter = 1;
    this.cruiseIdCounter = 1;
    this.bookingIdCounter = 1;

    this.initializeSampleData();
  }

  async initializeSampleData() {
    await this.createUser({
      username: "admin",
      email: "admin@cruises.com",
      password: "$2b$10$X4kv7j5ZcG39WgogSl16beuL8dS.ioNGJs1L2Y8oHT5npk3uYXIry",
      firstName: "Admin",
      lastName: "User",
      phoneNumber: "123-456-7890",
      isAdmin: true,
      profilePicture: "",
    });

    await this.createUser({
      username: "customer",
      email: "customer@example.com",
      password: "$2b$10$X4kv7j5ZcG39WgogSl16beuL8dS.ioNGJs1L2Y8oHT5npk3uYXIry",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-123-4567",
      isAdmin: false,
      profilePicture: "",
    });

    await this.createCruise({
      name: "Caribbean Paradise",
      description: "Enjoy crystal clear waters, white sand beaches, and luxurious accommodations...",
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
      departureOptions: ["2025-06-15", "2025-07-05", "2025-07-25", "2025-08-15"],
    });

    await this.createCruise({
      name: "Mediterranean Magic",
      description: "Sail the ancient seas and explore Italy, Greece, and Turkey...",
      departureLocation: "Barcelona",
      destinationLocation: "Venice",
      duration: 10,
      basePrice: 1799,
      taxesFees: 249,
      gratuities: 110,
      image: "https://images.unsplash.com/photo-1575832731348-5b8b4b7310aa",
      rating: 4.7,
      reviewCount: 212,
      isActive: true,
      departureOptions: ["2025-05-20", "2025-06-10", "2025-07-01"],
    });
  }

  async createUser(userData) {
    const userId = this.userIdCounter++;
    this.users.set(userId, { id: userId, ...userData });
    return this.users.get(userId);
  }

  async createCruise(cruiseData) {
    const cruiseId = this.cruiseIdCounter++;
    this.cruises.set(cruiseId, { id: cruiseId, ...cruiseData });
    return this.cruises.get(cruiseId);
  }

  async createBooking(bookingData) {
    const bookingId = this.bookingIdCounter++;
    this.bookings.set(bookingId, { id: bookingId, ...bookingData });
    return this.bookings.get(bookingId);
  }

  getUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  getUserById(id) {
    return this.users.get(id);
  }

  getAllCruises() {
    return Array.from(this.cruises.values());
  }

  getCruiseById(id) {
    return this.cruises.get(id);
  }

  getAllBookingsForUser(userId) {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  deleteBookingById(bookingId) {
    return this.bookings.delete(bookingId);
  }
}

export default { MemStorage };
