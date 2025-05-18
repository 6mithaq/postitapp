import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
//import { Cruise } from "./shared/schema";
import CruiseCard from "../Components/CruiseCard";
import SearchCruises from "../Components/SearchCruises";
import { Loader2 } from "lucide-react";

export default function CruisesPage() {
  const [filteredCruises, setFilteredCruises] = useState(null);
  
  const { data: cruises, isLoading, isError } = useQuery({
    queryKey: ["/api/cruises"],
  });


  // Handle search/filter results
const handleSearchResults = (results) => {
  setFilteredCruises(results);
};

  // Reset filters
  const resetFilters = () => {
    setFilteredCruises(null);
  };

  // Determine which cruises to display
  const displayCruises = filteredCruises || cruises;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-primary text-white rounded-lg p-8 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold font-heading mb-4">Explore Our Cruise Packages</h1>
            <p className="text-lg mb-0">
              Discover amazing cruise experiences to destinations around the world. Find your perfect vacation with our selection of premium cruise packages.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchCruises onSearchResults={handleSearchResults} cruises={cruises} />
          
          {filteredCruises && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-muted-foreground">
                {filteredCruises.length} {filteredCruises.length === 1 ? 'result' : 'results'} found
              </span>
              <button 
                onClick={resetFilters}
                className="ml-4 text-sm text-primary hover:text-primary/90 font-medium"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Cruises Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-heading mb-6">Available Cruises</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p>Error loading cruises. Please try again later.</p>
            </div>
          ) : displayCruises && displayCruises.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayCruises.map((cruise) => (
                <CruiseCard key={cruise.id} cruise={cruise} />
              ))}
            </div>
          ) : (
            <div className="bg-muted p-8 rounded-md text-center">
              <h3 className="text-lg font-medium mb-2">No cruises found</h3>
              <p className="text-muted-foreground">
                No cruises match your current search criteria. Try adjusting your filters or browse all cruises.
              </p>
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-heading mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-lg overflow-hidden h-64 group">
              <img 
                src="https://images.unsplash.com/photo-1580541631971-c7f8c0f8e414" 
                alt="Caribbean" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">Caribbean</h3>
                <p className="text-white/80">Crystal clear waters & white sand beaches</p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden h-64 group">
              <img 
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401" 
                alt="Mediterranean" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">Mediterranean</h3>
                <p className="text-white/80">Rich history, culture & cuisine</p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden h-64 group">
              <img 
                src="https://images.unsplash.com/photo-1579656450812-5b1da79e7cc3" 
                alt="Alaska" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">Alaska</h3>
                <p className="text-white/80">Majestic glaciers & wildlife</p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden h-64 group">
              <img 
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e" 
                alt="South Pacific" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">South Pacific</h3>
                <p className="text-white/80">Paradise islands & tropical wonders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold font-heading mb-6">Cruise Travel Tips</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-2">When to Book</h3>
              <p className="text-muted-foreground">
                For the best deals, book your cruise 6-12 months in advance. Last-minute deals can offer savings, but selection may be limited.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What to Pack</h3>
              <p className="text-muted-foreground">
                Pack versatile clothing, comfortable shoes, swimwear, formal attire for dinners, and don't forget essentials like sunscreen and medication.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Onboard Activities</h3>
              <p className="text-muted-foreground">
                Review the daily activity schedule and pre-book popular excursions to ensure you don't miss out on the experiences you're most interested in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
