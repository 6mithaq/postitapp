import { createServer } from "http";
import { storage } from "../storage.js";
import { setupAuth } from "../auth.js";
import { createBookingSchema, insertCruiseSchema } from "@shared/schema";
import { z } from "zod";

// Node environment only
const tailwindConfig = require('./tailwind.config.js');


// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
};

async function registerRoutes(app) {
  setupAuth(app);

  // CRUISE ROUTES

  app.get(`${ENV.SERVER_URL}/api/cruises`, async (req, res) => {
    try {
      const cruises = await storage.getAllCruises();
      res.json(cruises);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cruises", error });
    }
  });

  app.get(`${ENV.SERVER_URL}/api/cruises/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cruise = await storage.getCruise(id);
      if (!cruise) {
        return res.status(404).json({ message: "Cruise not found" });
      }
      res.json(cruise);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cruise", error });
    }
  });

  app.post(`${ENV.SERVER_URL}/api/cruises`, isAdmin, async (req, res) => {
    try {
      const cruiseData = insertCruiseSchema.parse(req.body);
      const cruise = await storage.createCruise(cruiseData);
      res.status(201).json(cruise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cruise data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating cruise", error });
    }
  });

  app.put(`${ENV.SERVER_URL}/api/cruises/:id`, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cruiseData = insertCruiseSchema.parse(req.body);
      const updatedCruise = await storage.updateCruise(id, cruiseData);
      if (!updatedCruise) {
        return res.status(404).json({ message: "Cruise not found" });
      }
      res.json(updatedCruise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cruise data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating cruise", error });
    }
  });

  app.delete(`${ENV.SERVER_URL}/api/cruises/:id`, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCruise(id);
      if (!deleted) {
        return res.status(404).json({ message: "Cruise not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting cruise", error });
    }
  });

  // BOOKING ROUTES

  app.post(`${ENV.SERVER_URL}/api/calculate-price`, async (req, res) => {
    try {
      const bookingData = createBookingSchema.parse(req.body);
      const { totalPrice, breakdown } = await storage.calculateBookingPrice(bookingData);
      res.json({ totalPrice, breakdown });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Error calculating price", error });
    }
  });

  app.post(`${ENV.SERVER_URL}/api/bookings`, isAuthenticated, async (req, res) => {
    try {
      const bookingData = createBookingSchema.parse(req.body);
      const userId = req.user.id;

      const { totalPrice } = await storage.calculateBookingPrice(bookingData);
      const booking = await storage.createBooking({
        ...bookingData,
        userId,
        totalPrice,
        status: "pending",
      });

      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating booking", error });
    }
  });

  app.get(`${ENV.SERVER_URL}/api/bookings`, isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  });

  app.get(`${ENV.SERVER_URL}/api/admin/bookings`, isAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  });

  app.patch(`${ENV.SERVER_URL}/api/bookings/:id/status`, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const booking = await storage.updateBookingStatus(id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status", error });
    }
  });

  app.get(`${ENV.SERVER_URL}/api/admin/users`, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

export default { registerRoutes };
