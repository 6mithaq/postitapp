import { useState } from "react";
import { Cruise, CreateBookingInput } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  cruise: Cruise;
  bookingData: CreateBookingInput;
  onChange: (data: Partial<CreateBookingInput>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  cruise,
  bookingData,
  onChange,
  onSubmit,
  isSubmitting,
}) => {
  const { user } = useAuth();
  const [departureDateStr, setDepartureDateStr] = useState<string>(cruise.departureOptions?.[0] || "");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Handle cabin type change
  const handleCabinTypeChange = (value: string) => {
    onChange({ cabinType: value as "interior" | "oceanview" | "balcony" | "suite" });
  };

  // Handle adults count change
  const handleAdultsChange = (value: string) => {
    onChange({ adults: parseInt(value) });
  };

  // Handle children count change
  const handleChildrenChange = (value: string) => {
    onChange({ children: parseInt(value) });
  };

  // Handle departure date change
  const handleDepartureDateChange = (value: string) => {
    setDepartureDateStr(value);
    onChange({ departureDate: value });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="cabin-type" className="text-lg font-medium text-foreground mb-2">
            Select Cabin Type
          </Label>
          <Select value={bookingData.cabinType} onValueChange={handleCabinTypeChange}>
            <SelectTrigger id="cabin-type" className="w-full mb-4">
              <SelectValue placeholder="Select cabin type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interior">Interior Cabin</SelectItem>
              <SelectItem value="oceanview">Ocean View</SelectItem>
              <SelectItem value="balcony">Balcony</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="guests" className="text-lg font-medium text-foreground mb-2">
            Number of Guests
          </Label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="adults" className="block text-sm text-muted-foreground mb-1">
                Adults
              </Label>
              <Select value={bookingData.adults.toString()} onValueChange={handleAdultsChange}>
                <SelectTrigger id="adults" className="w-full">
                  <SelectValue placeholder="Select number of adults" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="children" className="block text-sm text-muted-foreground mb-1">
                Children
              </Label>
              <Select
                value={bookingData.children.toString()}
                onValueChange={handleChildrenChange}
              >
                <SelectTrigger id="children" className="w-full">
                  <SelectValue placeholder="Select number of children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="departure-date" className="text-lg font-medium text-foreground mb-2">
            Departure Date
          </Label>
          <Select value={departureDateStr} onValueChange={handleDepartureDateChange}>
            <SelectTrigger id="departure-date" className="w-full mb-6">
              <SelectValue placeholder="Select departure date" />
            </SelectTrigger>
            <SelectContent>
              {cruise.departureOptions?.map((date) => (
                <SelectItem key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-light text-white font-medium py-3 px-4 rounded transition-colors"
          disabled={isSubmitting || !user}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Book Now"
          )}
        </Button>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          {user ? "No deposit required. Pay later." : "Please login to book this cruise."}
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
