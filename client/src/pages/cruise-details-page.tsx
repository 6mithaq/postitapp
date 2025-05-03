import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Cruise, CreateBookingInput } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import BookingForm from "@/components/BookingForm";
import { Loader2, MapPin, Calendar, Star, Clock } from "lucide-react";

export default function CruiseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch cruise details
  const { data: cruise, isLoading, isError } = useQuery<Cruise>({
    queryKey: [`/api/cruises/${id}`],
  });

  // For price calculation
  const [bookingData, setBookingData] = useState<CreateBookingInput>({
    cruiseId: numericId,
    cabinType: "interior",
    adults: 2,
    children: 0,
    departureDate: cruise?.departureOptions?.[0] || ""
  });

  // Calculate booking price
  const { data: priceCalculation, isLoading: isPriceLoading } = useQuery({
    queryKey: ['/api/calculate-price', bookingData],
    queryFn: async () => {
      const res = await apiRequest('POST', '/api/calculate-price', bookingData);
      return res.json();
    },
    enabled: !!cruise,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      const res = await apiRequest('POST', '/api/bookings', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: "Your cruise has been booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error booking your cruise. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle booking
  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to book a cruise.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    createBookingMutation.mutate(bookingData);
  };

  // Handle booking data change
  const handleBookingDataChange = (data: Partial<CreateBookingInput>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !cruise) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Cruise Not Found</h2>
          <p className="mb-6">The cruise you're looking for could not be found or is no longer available.</p>
          <Button onClick={() => navigate('/cruises')}>View All Cruises</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl font-heading">
              {cruise.name}
            </h1>
            <div className="flex flex-wrap items-center mt-2 text-sm text-muted-foreground">
              <div className="flex items-center mr-4 mb-2">
                <MapPin className="h-4 w-4 text-secondary mr-1" />
                <span>{cruise.departureLocation} to {cruise.destinationLocation}</span>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <Clock className="h-4 w-4 text-secondary mr-1" />
                <span>{cruise.duration} Days</span>
              </div>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-accent mr-1" />
                <span className="flex items-center">
                  {cruise.rating.toFixed(1)}
                  <span className="ml-1">({cruise.reviewCount} reviews)</span>
                </span>
              </div>
            </div>
            
            {/* Cruise Image */}
            <div className="mt-6 relative">
              <img 
                className="w-full h-96 object-cover rounded-lg"
                src={cruise.image}
                alt={cruise.name}
              />
            </div>
            
            {/* Cruise Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                Cruise Description
              </h2>
              <p className="text-muted-foreground mb-4">
                {cruise.description}
              </p>
            </div>
            
            {/* Itinerary */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">Itinerary</h2>
              <div className="border-l-2 border-secondary pl-4 space-y-6">
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary -ml-[17px]"></div>
                    <h3 className="ml-2 text-lg font-medium text-foreground">Day 1: {cruise.departureLocation}</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">Embarkation from 12:00 PM to 4:00 PM. Ship departs at 5:00 PM.</p>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary -ml-[17px]"></div>
                    <h3 className="ml-2 text-lg font-medium text-foreground">Day 2: At Sea</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">Enjoy a full day of activities and relaxation aboard the ship.</p>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary -ml-[17px]"></div>
                    <h3 className="ml-2 text-lg font-medium text-foreground">Day 3-{cruise.duration-1}: Various Ports</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">Explore beautiful ports of call including local attractions and stunning beaches.</p>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary -ml-[17px]"></div>
                    <h3 className="ml-2 text-lg font-medium text-foreground">Day {cruise.duration}: {cruise.departureLocation}</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">Arrive at 7:00 AM. Disembarkation begins at 8:00 AM.</p>
                </div>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">Onboard Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Multiple Restaurants</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Swimming Pools</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Spa & Wellness</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Entertainment Shows</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Fitness Center</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Kids Club</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Panel */}
          <div className="mt-12 lg:mt-0 lg:col-span-4">
            <Card className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-20">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 font-heading">Booking Summary</h3>
                
                {isPriceLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span className="font-medium">${priceCalculation?.breakdown.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cabin Upgrade:</span>
                      <span className="font-medium">${priceCalculation?.breakdown.cabinUpgrade.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes & Fees:</span>
                      <span className="font-medium">${priceCalculation?.breakdown.taxesFees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gratuities:</span>
                      <span className="font-medium">${priceCalculation?.breakdown.gratuities.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-2">
                      <span className="text-lg font-bold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-primary">${priceCalculation?.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <BookingForm 
                  cruise={cruise} 
                  bookingData={bookingData} 
                  onChange={handleBookingDataChange}
                  onSubmit={handleBooking}
                  isSubmitting={createBookingMutation.isPending}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
