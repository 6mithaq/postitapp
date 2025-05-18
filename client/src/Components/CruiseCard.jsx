import { Link } from "wouter";
import { Card, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { StarIcon, MapPinIcon } from "lucide-react";

const CruiseCard = ({ cruise }) => {
  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  return (
    <Card className="group bg-white overflow-hidden shadow-card rounded-lg transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={cruise.image}
          alt={cruise.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <div className="text-xs font-semibold text-white uppercase tracking-wider">
            {cruise.duration} Days
          </div>
          <h3 className="text-lg font-bold text-white font-heading">{cruise.name}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 text-secondary mr-1" />
            <span className="text-sm text-muted-foreground">
              {cruise.departureLocation} to {cruise.destinationLocation}
            </span>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-accent" />
            <span className="ml-1 text-sm">{formatRating(cruise.rating)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {cruise.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primary-dark font-semibold">${cruise.basePrice}</span>
          <span className="text-sm text-muted-foreground">per person</span>
        </div>
        <Link href={`/cruises/${cruise.id}`}>
          <Button className="mt-4 w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded transition-colors">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CruiseCard;
