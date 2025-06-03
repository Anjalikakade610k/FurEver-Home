
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Sparkles } from "lucide-react";
import { Dog } from "../services/dogService";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedDog: Dog | null;
}

const MatchModal = ({ isOpen, onClose, matchedDog }: MatchModalProps) => {
  if (!matchedDog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
            It's a Match!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={matchedDog.img}
                alt={matchedDog.name}
                className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-gray-900">{matchedDog.name}</h3>
            <p className="text-lg text-gray-600">{matchedDog.breed}</p>
            <p className="text-gray-600">
              {matchedDog.age} year{matchedDog.age !== 1 ? 's' : ''} old
            </p>
            <div className="flex items-center justify-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{matchedDog.zip_code}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-center text-gray-700">
              Based on your favorites, <strong>{matchedDog.name}</strong> could be your perfect companion! 
              Consider reaching out to the shelter to learn more about adopting this wonderful dog.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
          >
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchModal;
