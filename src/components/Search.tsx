
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, LogOut, Search as SearchIcon, Sparkles } from "lucide-react";
import { dogService, Dog, SearchParams } from "../services/dogService";
import { toast } from "@/hooks/use-toast";
import DogCard from "./DogCard";
import MatchModal from "./MatchModal";

interface SearchProps {
  onLogout: () => void;
}

const Search = ({ onLogout }: SearchProps) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("breed:asc");
  const [currentPage, setCurrentPage] = useState<string>("");
  const [nextPage, setNextPage] = useState<string>("");
  const [prevPage, setPrevPage] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    loadBreeds();
    searchDogs();
  }, []);

  const loadBreeds = async () => {
    try {
      const breedList = await dogService.getBreeds();
      setBreeds(breedList.sort());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dog breeds.",
        variant: "destructive",
      });
    }
  };

  const searchDogs = async (params: SearchParams = {}) => {
    setIsLoading(true);
    try {
      const searchParams: SearchParams = {
        size: 25,
        sort: sortOrder,
        ...params,
      };

      if (selectedBreeds.length > 0) {
        searchParams.breeds = selectedBreeds;
      }

      const result = await dogService.searchDogs(searchParams);
      
      if (result.resultIds.length > 0) {
        const dogData = await dogService.getDogs(result.resultIds);
        setDogs(dogData);
      } else {
        setDogs([]);
      }

      setTotal(result.total);
      setNextPage(result.next || "");
      setPrevPage(result.prev || "");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search dogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreedSelect = (breed: string) => {
    if (!selectedBreeds.includes(breed)) {
      const newBreeds = [...selectedBreeds, breed];
      setSelectedBreeds(newBreeds);
      searchDogs({ breeds: newBreeds });
    }
  };

  const removeBreed = (breed: string) => {
    const newBreeds = selectedBreeds.filter(b => b !== breed);
    setSelectedBreeds(newBreeds);
    searchDogs({ breeds: newBreeds.length > 0 ? newBreeds : undefined });
  };

  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    searchDogs({ sort: newSort });
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };

  const handleFindMatch = async () => {
    if (favorites.length === 0) {
      toast({
        title: "No Favorites",
        description: "Please add some dogs to your favorites first!",
        variant: "destructive",
      });
      return;
    }

    try {
      const match = await dogService.getMatch(favorites);
      const matchedDogData = await dogService.getDogs([match.match]);
      setMatchedDog(matchedDogData[0]);
      setShowMatchModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find your match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigatePage = (pageQuery: string) => {
    if (!pageQuery) return;
    
    // Extract the 'from' parameter from the query string
    const urlParams = new URLSearchParams(pageQuery.split('?')[1]);
    const from = urlParams.get('from');
    
    if (from) {
      searchDogs({ from });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dog Adoption</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleFindMatch}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={favorites.length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Find My Match ({favorites.length})
              </Button>
              <Button onClick={onLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Breed
                </label>
                <Select onValueChange={handleBreedSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a breed to filter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white">
                    {breeds.map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <Select value={sortOrder} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="breed:asc">Breed (A-Z)</SelectItem>
                    <SelectItem value="breed:desc">Breed (Z-A)</SelectItem>
                    <SelectItem value="name:asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name:desc">Name (Z-A)</SelectItem>
                    <SelectItem value="age:asc">Age (Youngest)</SelectItem>
                    <SelectItem value="age:desc">Age (Oldest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Breeds */}
            {selectedBreeds.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Breeds:
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedBreeds.map((breed) => (
                    <Badge 
                      key={breed} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeBreed(breed)}
                    >
                      {breed} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {isLoading ? "Searching..." : `Found ${total} dogs`}
          </p>
          
          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigatePage(prevPage)}
              disabled={!prevPage || isLoading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => navigatePage(nextPage)}
              disabled={!nextPage || isLoading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Dog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : dogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.includes(dog.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No dogs found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedDog={matchedDog}
      />
    </div>
  );
};

export default Search;
