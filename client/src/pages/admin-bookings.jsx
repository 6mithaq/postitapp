import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Booking, Cruise, User } from "@shared/schema";
import { useToast } from "./hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Card, CardContent } from "../Components/ui/card";
import { Separator } from "../Components/ui/separator";
import { Badge } from "../Components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../Components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { Loader2, MoreVertical, Search, CheckCircle, XCircle, Eye, Calendar, DollarSign, Ship, Users } from "lucide-react";

export default function AdminBookings() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  // Fetch bookings
const { 
  data: bookings, 
  isLoading: isBookingsLoading, 
  isError: isBookingsError 
} = useQuery({
  queryKey: ["/api/admin/bookings"],
});

// Fetch cruises for lookup
const { 
  data: cruises, 
  isLoading: isCruisesLoading 
} = useQuery({
  queryKey: ["/api/cruises"],
});

// Fetch users for lookup
const { 
  data: users, 
  isLoading: isUsersLoading 
} = useQuery({
  queryKey: ["/api/admin/users"],
});

  
  // Update booking status mutation
const updateStatusMutation = useMutation({
  mutationFn: async ({ id, status }) => {
    const res = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    toast({
      title: "Success",
      description: "Booking status updated successfully",
    });
    setIsStatusDialogOpen(false);
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: `Failed to update booking status: ${error.message}`,
      variant: "destructive",
    });
  },
});

// Handle view details
const handleViewDetails = (booking) => {
  setSelectedBooking(booking);
  setIsDetailsOpen(true);
};

// Handle change status click
const handleChangeStatus = (booking) => {
  setSelectedBooking(booking);
  setNewStatus(booking.status);
  setIsStatusDialogOpen(true);
};

// Handle status update
const handleStatusUpdate = () => {
  if (selectedBooking && newStatus) {
    updateStatusMutation.mutate({ id: selectedBooking.id, status: newStatus });
  }
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

  
  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.id.toString().includes(searchQuery) ||
      (users?.find(u => u.id === booking.userId)?.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cruises?.find(c => c.id === booking.cruiseId)?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const isLoading = isBookingsLoading || isCruisesLoading || isUsersLoading;
  
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-heading">
            Manage Bookings
          </h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-blue-100 rounded-md mr-4">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-semibold">
                  ${bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0).toFixed(2) || '0.00'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-green-100 rounded-md mr-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-xl font-semibold">
                  {bookings?.filter(booking => booking.status === 'confirmed').length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-yellow-100 rounded-md mr-4">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold">
                  {bookings?.filter(booking => booking.status === 'pending').length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-red-100 rounded-md mr-4">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-xl font-semibold">
                  {bookings?.filter(booking => booking.status === 'cancelled').length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="ml-auto" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isBookingsError ? (
              <div className="bg-destructive/10 text-destructive p-4 m-4 rounded-md">
                <p>Error loading bookings. Please try again later.</p>
              </div>
            ) : filteredBookings && filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Cruise</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => {
                      const bookingUser = users?.find(u => u.id === booking.userId);
                      const cruise = cruises?.find(c => c.id === booking.cruiseId);
                      
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">#{booking.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                                  {bookingUser?.firstName?.charAt(0)}{bookingUser?.lastName?.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-foreground">
                                  {bookingUser?.firstName} {bookingUser?.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {bookingUser?.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">
                              {cruise?.name || `Cruise #${booking.cruiseId}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {cruise?.departureLocation} to {cruise?.destinationLocation}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">
                              {formatDate(booking.departureDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {booking.adults} Adults, {booking.children} Children
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">
                            ${booking.totalPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={getStatusColor(booking.status)}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeStatus(booking)}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>Change Status</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Ship className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter 
                    ? "No bookings match your search criteria" 
                    : "There are no bookings in the system yet"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Booking Information</h3>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Booking ID</span>
                        <p className="font-medium">#{selectedBooking.id}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Status</span>
                        <p>
                          <Badge className={getStatusColor(selectedBooking.status)}>
                            {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                          </Badge>
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Booking Date</span>
                        <p className="font-medium">{formatDate(selectedBooking.createdAt)}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Last Updated</span>
                        <p className="font-medium">{formatDate(selectedBooking.updatedAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h3 className="text-lg font-medium mt-6 mb-3">Customer Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      {users && (
                        <div className="space-y-3">
                          {(() => {
                            const user = users.find(u => u.id === selectedBooking.userId);
                            if (!user) return <p>User information not available</p>;
                            
                            return (
                              <>
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <span className="text-sm text-muted-foreground">Email</span>
                                  <p className="font-medium">{user.email}</p>
                                </div>
                                
                                {user.phoneNumber && (
                                  <div>
                                    <span className="text-sm text-muted-foreground">Phone</span>
                                    <p className="font-medium">{user.phoneNumber}</p>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Cruise Details</h3>
                  <Card>
                    <CardContent className="p-4">
                      {cruises && (
                        <div className="space-y-3">
                          {(() => {
                            const cruise = cruises.find(c => c.id === selectedBooking.cruiseId);
                            if (!cruise) return <p>Cruise information not available</p>;
                            
                            return (
                              <>
                                <div className="mb-3">
                                  <img 
                                    src={cruise.image} 
                                    alt={cruise.name} 
                                    className="w-full h-36 object-cover rounded-md"
                                  />
                                </div>
                                
                                <div>
                                  <h4 className="font-bold text-lg">{cruise.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {cruise.departureLocation} to {cruise.destinationLocation}
                                  </p>
                                </div>
                                
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="mr-1">Departure:</span>
                                  <span className="font-medium">{formatDate(selectedBooking.departureDate)}</span>
                                </div>
                                
                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="mr-1">Guests:</span>
                                  <span className="font-medium">
                                    {selectedBooking.adults} Adults{selectedBooking.children > 0 ? `, ${selectedBooking.children} Children` : ''}
                                  </span>
                                </div>
                                
                                <div className="flex items-center text-sm">
                                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="mr-1">Cabin Type:</span>
                                  <span className="font-medium capitalize">{selectedBooking.cabinType}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <h3 className="text-lg font-medium mt-6 mb-3">Payment Details</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Base Price:</span>
                          <span>${(selectedBooking.totalPrice * 0.7).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Taxes & Fees:</span>
                          <span>${(selectedBooking.totalPrice * 0.2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Gratuities:</span>
                          <span>${(selectedBooking.totalPrice * 0.1).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-semibold">Total:</span>
                          <span className="font-semibold text-primary">${selectedBooking.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleChangeStatus(selectedBooking);
                  }}
                >
                  Change Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Booking Status</DialogTitle>
            <DialogDescription>
              Update the status for booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-4">
              {newStatus === 'confirmed' && (
                <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                  <p className="font-medium">Confirming this booking will:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Reserve a cabin for the customer</li>
                    <li>Send a confirmation email to the customer</li>
                    <li>Allow the customer to access their booking details</li>
                  </ul>
                </div>
              )}
              
              {newStatus === 'cancelled' && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
                  <p className="font-medium">Cancelling this booking will:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Release the reserved cabin</li>
                    <li>Send a cancellation notice to the customer</li>
                    <li>Mark the booking as cancelled in the system</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={!newStatus || newStatus === selectedBooking?.status || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
