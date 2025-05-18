import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "./hooks/use-auth";
import { Card, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Loader2, Ship, Users, DollarSign, Anchor } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Components/ui/table";
import {
  Badge
} from "../Components/ui/badge";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Fetch bookings
  const {
    data: bookings,
    isLoading: isBookingsLoading,
  } = useQuery({
    queryKey: ["/api/admin/bookings"],
  });
  
  // Fetch users
  const {
    data: users,
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ["/api/admin/users"],
  });
  
  // Fetch cruises
  const {
    data: cruises,
    isLoading: isCruisesLoading,
  } = useQuery({
    queryKey: ["/api/cruises"],
  });
  
  const isLoading = isBookingsLoading || isUsersLoading || isCruisesLoading;
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Calculate totals
  const totalBookings = bookings?.length || 0;
  const totalUsers = users?.length || 0;
  const totalCruises = cruises?.length || 0;
  const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) || 0;
  
  // Get recent bookings
  const recentBookings = bookings?.slice(0, 5) || [];
  
  // Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

  
  return (
    <div className="bg-ocean-dark text-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-heading">Admin Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user?.firstName}</span>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden text-foreground">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary rounded-md p-3">
                    <Ship className="text-white h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">Total Bookings</dt>
                      <dd className="text-lg font-medium text-foreground">{totalBookings}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-background px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/bookings">
                    <a className="font-medium text-primary hover:text-primary-light">View all</a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden text-foreground">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-secondary rounded-md p-3">
                    <Users className="text-white h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">Registered Users</dt>
                      <dd className="text-lg font-medium text-foreground">{totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-background px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/users">
                    <a className="font-medium text-primary hover:text-primary-light">View all</a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden text-foreground">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-accent rounded-md p-3">
                    <DollarSign className="text-white h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-foreground">${totalRevenue.toFixed(2)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-background px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/bookings">
                    <a className="font-medium text-primary hover:text-primary-light">View details</a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden text-foreground">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <Anchor className="text-white h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">Available Cruises</dt>
                      <dd className="text-lg font-medium text-foreground">{totalCruises}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-background px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/cruises">
                    <a className="font-medium text-primary hover:text-primary-light">Manage cruises</a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Bookings */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden text-foreground">
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-foreground">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Cruise</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No bookings found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentBookings.map((booking) => {
                      const bookingUser = users?.find(u => u.id === booking.userId);
                      const cruise = cruises?.find(c => c.id === booking.cruiseId);
                      
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">#{booking.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                                  {bookingUser?.firstName?.charAt(0)}{bookingUser?.lastName?.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">
                                  {bookingUser?.firstName} {bookingUser?.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {bookingUser?.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">
                              {cruise?.name || `Cruise #${booking.cruiseId}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(booking.departureDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {formatDate(booking.createdAt)}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            ${booking.totalPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/bookings/${booking.id}`}>
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-light mr-2">
                                Edit
                              </Button>
                            </Link>
                            {booking.status === 'pending' && (
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="bg-background px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">5</span> of <span className="font-medium">{totalBookings}</span> bookings
                </div>
                <div>
                  <Link href="/admin/bookings">
                    <Button variant="outline" size="sm">
                      View All Bookings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/admin/cruises/new">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Ship className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-lg font-medium text-foreground">Add New Cruise</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/bookings">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-accent mr-3" />
                  <h3 className="text-lg font-medium text-foreground">Manage Bookings</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/users">
            <Card className="hover:shadow-lg cursor-pointer transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-secondary mr-3" />
                  <h3 className="text-lg font-medium text-foreground">View Users</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
