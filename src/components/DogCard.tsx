
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog } from "../services/dogService";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

const DogCard = ({ dog, isFavorite, onToggleFavorite }: DogCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border-0 shadow-sm">
      <div className="relative">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <Button
          onClick={() => onToggleFavorite(dog.id)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
          }`}
          size="sm"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
          />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {dog.name}
            </h3>
            <Badge variant="secondary" className="mt-1">
              {dog.breed}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">
              {dog.age} year{dog.age !== 1 ? 's' : ''} old
            </span>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{dog.zip_code}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogCard;
