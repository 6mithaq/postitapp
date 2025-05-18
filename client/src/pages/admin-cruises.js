import { useEffect, useState } from "react";
import '../index.css';

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Button } from "../Components/ui/button";
import { Card } from "../Components/ui/card";
import { Separator } from "../Components/ui/separator";
import { Loader2, MapPin, Star, Clock } from "lucide-react";
import BookingForm from "../Components/BookingForm";

export default function CruiseDetailsPage() {
  const { id } = useParams();
  const numericId = parseInt(id, 10);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Always define hooks unconditionally
  const { data: cruise, isLoading, isError } = useQuery({
    queryKey: [`/api/cruises/${id}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/cruises/${id}`);
      return res.json();
    },
    enabled: !!id,
  });

  const [bookingData, setBookingData] = useState({
    cruiseId: numericId,
    cabinType: "interior",
    adults: 2,
    children: 0,
    departureDate: "", // set later when cruise is loaded
  });

  useEffect(() => {
    if (cruise?.departureOptions?.[0]) {
      setBookingData((prev) => ({
        ...prev,
        departureDate: cruise.departureOptions[0],
      }));
    }
  }, [cruise]);

  const { data: priceCalculation, isLoading: isPriceLoading } = useQuery({
    queryKey: ["/api/calculate-price", bookingData],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/calculate-price", bookingData);
      return res.json();
    },
    enabled: !!cruise,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: "Your cruise has been booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description:
          error.message ||
          "There was an error booking your cruise. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to view this page.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, toast, navigate]);

  if (!user) return null;

  const handleBooking = () => {
    createBookingMutation.mutate(bookingData);
  };

  const handleBookingDataChange = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
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
          <p className="mb-6">
            The cruise you're looking for could not be found or is no longer available.
          </p>
          <Button onClick={() => navigate("/cruises")}>View All Cruises</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {cruise.name}
            </h1>
            <div className="flex flex-wrap items-center mt-2 text-sm text-muted-foreground">
              <div className="flex items-center mr-4 mb-2">
                <MapPin className="h-4 w-4 text-secondary mr-1" />
                <span>
                  {cruise.departureLocation} to {cruise.destinationLocation}
                </span>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <Clock className="h-4 w-4 text-secondary mr-1" />
                <span>{cruise.duration} Days</span>
              </div>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-accent mr-1" />
                <span className="flex items-center">
                  {cruise.rating.toFixed(1)} ({cruise.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="mt-6 relative">
              <img
                className="w-full h-96 object-cover rounded-lg"
                src={cruise.image}
                alt={cruise.name}
              />
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Cruise Description</h2>
              <p className="text-muted-foreground mb-4">{cruise.description}</p>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-4">
            <Card className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-20">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                {isPriceLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span className="font-medium">
                        ${priceCalculation?.breakdown.basePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cabin Upgrade:</span>
                      <span className="font-medium">
                        ${priceCalculation?.breakdown.cabinUpgrade.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes & Fees:</span>
                      <span className="font-medium">
                        ${priceCalculation?.breakdown.taxesFees.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gratuities:</span>
                      <span className="font-medium">
                        ${priceCalculation?.breakdown.gratuities.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-2">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold text-primary">
                        ${priceCalculation?.totalPrice.toFixed(2)}
                      </span>
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
