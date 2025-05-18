import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SearchCruises = ({ onSearchResults, cruises = [] }) => {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [duration, setDuration] = useState("");

  // Create a unique list of destinations from available cruises
  const destinations = cruises.length > 0
    ? Array.from(new Set(cruises.map(cruise => cruise.destinationLocation)))
    : ["Caribbean", "Mediterranean", "Alaska", "Europe", "Asia"];

  const handleSearch = (e) => {
    e.preventDefault();

    if (!cruises || cruises.length === 0) return;

    let results = [...cruises];

    if (destination) {
      results = results.filter(cruise =>
        cruise.destinationLocation.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (duration) {
      switch (duration) {
        case "1-5":
          results = results.filter(cruise => cruise.duration >= 1 && cruise.duration <= 5);
          break;
        case "6-9":
          results = results.filter(cruise => cruise.duration >= 6 && cruise.duration <= 9);
          break;
        case "10-14":
          results = results.filter(cruise => cruise.duration >= 10 && cruise.duration <= 14);
          break;
        case "15+":
          results = results.filter(cruise => cruise.duration >= 15);
          break;
      }
    }

    // For departure date, we would normally filter based on departure options
    // But for simplicity in the demo, we'll just pass all results

    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">Find Your Perfect Cruise</h2>
        <form className="grid grid-cols-1 gap-6 md:grid-cols-4" onSubmit={handleSearch}>
          <div>
            <Label htmlFor="destination" className="block text-sm font-medium text-muted-foreground mb-1">
              Destination
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination" className="w-full">
                <SelectValue placeholder="Any Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Destination</SelectItem>
                {destinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="departure-date" className="block text-sm font-medium text-muted-foreground mb-1">
              Departure Date
            </Label>
            <Input
              type="date"
              id="departure-date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="duration" className="block text-sm font-medium text-muted-foreground mb-1">
              Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration" className="w-full">
                <SelectValue placeholder="Any Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Duration</SelectItem>
                <SelectItem value="1-5">1-5 Days</SelectItem>
                <SelectItem value="6-9">6-9 Days</SelectItem>
                <SelectItem value="10-14">10-14 Days</SelectItem>
                <SelectItem value="15+">15+ Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Search Cruises
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchCruises;