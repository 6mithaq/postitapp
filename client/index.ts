// Type definitions only
export interface Cruise {
  id: number;
  name: string;
  description: string;
  departureLocation: string;
  destinationLocation: string;
  duration: number;
  basePrice: number;
  taxesFees: number;
  gratuities: number;
  image: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  departureOptions: string[];
}

export interface Booking {
  id: number;
  userId: number;
  cruiseId: number;
  cabinType: string;
  adults: number;
  children: number;
  departureDate: Date;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isAdmin: boolean;
  profilePicture?: string;
  createdAt: Date;
}