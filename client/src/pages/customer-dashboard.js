import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/use-auth";
//import { Booking, Cruise } from "../shared/schema";
import { Booking, Cruise, User } from "../shared/mockData";

import { Link } from "wouter";
import '../index.css';

import { Card, CardContent } from "../Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import { Button } from "../Components/ui/button";
//import { Button } from './button'; 
import { Loader2, Ship, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../Components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../Components/ui/dialog";
import {
  Badge
} from "../Components/ui/badge";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Fetch user bookings
const { 
  data: bookings, 
  isLoading: isBookingsLoading,
  isError: isBookingsError 
} = useQuery({
  queryKey: ["/api/bookings"],
});

// Fetch all cruises for lookup
const { 
  data: cruises, 
  isLoading: isCruisesLoading 
} = useQuery({
  queryKey: ["/api/cruises"],
});

const handleViewDetails = (booking) => {
  setSelectedBooking(booking);
  if (cruises) {
    const cruise = cruises.find(c => c.id === booking.cruiseId);
    setSelectedCruise(cruise || null);
  }
  setIsDetailsOpen(true);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
  
  const isLoading = isBookingsLoading || isCruisesLoading;
  
  // Group bookings
  const upcomingBookings = bookings?.filter(
    booking => new Date(booking.departureDate) >= new Date() && booking.status !== 'cancelled'
  ) || [];
  
  const pastBookings = bookings?.filter(
    booking => new Date(booking.departureDate) < new Date() || booking.status === 'cancelled'
  ) || [];

  return (
    <div className="bg-ocean-light py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl font-heading mb-6">My Dashboard</h1>
        <Card className="bg-white shadow-card rounded-lg overflow-hidden">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="bg-transparent border-b-0 p-0">
                <TabsTrigger
                  value="upcoming"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-6 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
                >
                  Upcoming Cruises
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-6 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
                >
                  Past Cruises
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-6 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
                >
                  Profile
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isBookingsError ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  <p>Error loading your bookings. Please try again later.</p>
                </div>
              ) : (
                <>
                  <TabsContent value="upcoming" className="mt-0">
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">My Upcoming Cruises</h2>
                    {upcomingBookings.length === 0 ? (
                      <div className="bg-muted p-8 rounded-md text-center">
                        <Ship className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No upcoming cruises</h3>
                        <p className="text-muted-foreground mb-4">
                          You don't have any upcoming cruise bookings. Explore our cruise packages and book your next adventure!
                        </p>
                        <Link href="/cruises">
                          <Button>Browse Cruises</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cruise</TableHead>
                              <TableHead>Dates</TableHead>
                              <TableHead>Cabin</TableHead>
                              <TableHead>Guests</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingBookings.map((booking) => {
                              const cruise = cruises?.find(c => c.id === booking.cruiseId);
                              return (
                                <TableRow key={booking.id}>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        {cruise && (
                                          <img
                                            className="h-10 w-10 rounded-full object-cover"
                                            src={cruise.image}
                                            alt={cruise.name}
                                          />
                                        )}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-foreground">
                                          {cruise?.name || `Cruise #${booking.cruiseId}`}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {cruise?.departureLocation} to {cruise?.destinationLocation}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-foreground">
                                      {formatDate(booking.departureDate)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {cruise?.duration} Days
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-foreground capitalize">
                                      {booking.cabinType}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm text-foreground">
                                    {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''}
                                  </TableCell>
                                  <TableCell className="text-sm text-foreground">
                                    ${booking.totalPrice.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(booking.status)} variant="outline">
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="link" 
                                      className="text-primary hover:text-primary-light"
                                      onClick={() => handleViewDetails(booking)}
                                    >
                                      View Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past" className="mt-0">
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Past Cruises</h2>
                    {pastBookings.length === 0 ? (
                      <div className="bg-muted p-8 rounded-md text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No past cruises</h3>
                        <p className="text-muted-foreground">
                          You don't have any past cruise bookings.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cruise</TableHead>
                              <TableHead>Dates</TableHead>
                              <TableHead>Cabin</TableHead>
                              <TableHead>Guests</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pastBookings.map((booking) => {
                              const cruise = cruises?.find(c => c.id === booking.cruiseId);
                              return (
                                <TableRow key={booking.id}>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        {cruise && (
                                          <img
                                            className="h-10 w-10 rounded-full object-cover"
                                            src={cruise.image}
                                            alt={cruise.name}
                                          />
                                        )}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-foreground">
                                          {cruise?.name || `Cruise #${booking.cruiseId}`}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {cruise?.departureLocation} to {cruise?.destinationLocation}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-foreground">
                                      {formatDate(booking.departureDate)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {cruise?.duration} Days
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-foreground capitalize">
                                      {booking.cabinType}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm text-foreground">
                                    {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''}
                                  </TableCell>
                                  <TableCell className="text-sm text-foreground">
                                    ${booking.totalPrice.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(booking.status)} variant="outline">
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="link" 
                                      className="text-primary hover:text-primary-light"
                                      onClick={() => handleViewDetails(booking)}
                                    >
                                      View Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="profile" className="mt-0">
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">My Profile</h2>
                    <div className="bg-background p-6 rounded-lg">
                      <div className="mb-6">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <h3 className="text-lg font-medium">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Account Information</h4>
                          <div className="bg-white p-4 rounded-md border">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Username</p>
                                <p>{user?.username}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p>{user?.phoneNumber || "Not provided"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Booking Statistics</h4>
                          <div className="bg-white p-4 rounded-md border">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Total Bookings</p>
                                <p>{bookings?.length || 0}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Upcoming Cruises</p>
                                <p>{upcomingBookings.length}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline" className="mr-2">
                          Edit Profile
                        </Button>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about your cruise booking
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && selectedCruise && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Cruise Information</h3>
                  <div className="mb-4">
                    <img 
                      src={selectedCruise.image} 
                      alt={selectedCruise.name} 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-bold text-lg">{selectedCruise.name}</h4>
                  <p className="text-muted-foreground mb-2">
                    {selectedCruise.departureLocation} to {selectedCruise.destinationLocation}
                  </p>
                  <p className="mb-4">{selectedCruise.description}</p>
                  
                  <div className="flex items-center text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Departure: {formatDate(selectedBooking.departureDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mb-2">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Duration: {selectedCruise.duration} days</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Booking Information</h3>
                  <div className="bg-background p-4 rounded-md mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                    <p className="font-medium mb-3">#{selectedBooking.id}</p>
                    
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="mb-3">
                      <Badge className={getStatusColor(selectedBooking.status)}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </Badge>
                    </p>
                    
                    <p className="text-sm text-muted-foreground mb-1">Cabin Type</p>
                    <p className="font-medium capitalize mb-3">{selectedBooking.cabinType}</p>
                    
                    <p className="text-sm text-muted-foreground mb-1">Guests</p>
                    <p className="font-medium mb-3">
                      {selectedBooking.adults} Adults{selectedBooking.children > 0 ? `, ${selectedBooking.children} Children` : ''}
                    </p>
                    
                    <p className="text-sm text-muted-foreground mb-1">Booking Date</p>
                    <p className="font-medium mb-3">{formatDate(selectedBooking.createdAt)}</p>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-3">Payment Summary</h3>
                  <div className="bg-background p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span>${selectedCruise.basePrice * selectedBooking.adults + (selectedCruise.basePrice * 0.75 * selectedBooking.children)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Cabin Upgrade:</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Taxes & Fees:</span>
                      <span>${selectedCruise.taxesFees * (selectedBooking.adults + selectedBooking.children)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Gratuities:</span>
                      <span>${selectedCruise.gratuities * (selectedBooking.adults + selectedBooking.children * 0.5)}</span>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${selectedBooking.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedBooking.status === 'pending' && new Date(selectedBooking.departureDate) > new Date() && (
                  <Button variant="destructive">
                    Cancel Booking
                  </Button>
                )}
                {selectedBooking.status === 'confirmed' && new Date(selectedBooking.departureDate) > new Date() && (
                  <Button>
                    Download Ticket
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
