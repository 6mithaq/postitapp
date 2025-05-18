//drizzle-schema.js (CommonJS-style for .js files with "type": "module")

import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
//import { Cruise } from "../shared/schema";
import { Cruise, insertCruiseSchema } from "../shared/schema";


// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cruises table
export const cruises = pgTable("cruises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  departureLocation: text("departure_location").notNull(),
  destinationLocation: text("destination_location").notNull(),
  duration: integer("duration").notNull(),
  basePrice: doublePrecision("base_price").notNull(),
  taxesFees: doublePrecision("taxes_fees").notNull(),
  gratuities: doublePrecision("gratuities").notNull(),
  image: text("image").notNull(),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  departureOptions: text("departure_options").array(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cruiseId: integer("cruise_id").notNull().references(() => cruises.id),
  cabinType: text("cabin_type").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").default(0).notNull(),
  departureDate: timestamp("departure_date").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const cruisesRelations = relations(cruises, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  cruise: one(cruises, {
    fields: [bookings.cruiseId],
    references: [cruises.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCruiseSchema = createInsertSchema(cruises).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true });

// Validation Types
export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export const createBookingSchema = z.object({
  cruiseId: z.number(),
  cabinType: z.enum(["interior", "oceanview", "balcony", "suite"]),
  adults: z.number().min(1).max(6),
  children: z.number().min(0).max(4),
  departureDate: z.string()
});
export { cruises as Cruise };
export { users as User };
export { bookings as Booking };
export const CreateBookingInput = createBookingSchema;
