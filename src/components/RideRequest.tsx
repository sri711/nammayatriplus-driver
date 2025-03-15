import { useState, useEffect } from "react";
import { X, Navigation, Clock, DollarSign, MapPin, Star, PhoneCall, ChevronUp, ChevronDown, Languages } from "lucide-react";
import { RideRequest as RideRequestType, mockNearbyRiders } from "@/data/mockData";
import { formatPrice, formatDistance, formatDuration } from "@/utils/calculationUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TranslationModal from "./TranslationModal";

interface RideRequestProps {
  request: RideRequestType;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onClose?: () => void;
  isFullScreen?: boolean;
  isAccepted?: boolean;
}

const RideRequest = ({
  request,
  onAccept,
  onDecline,
  onClose,
  isFullScreen = false,
  isAccepted = false,
}: RideRequestProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [rider, setRider] = useState(mockNearbyRiders[0]);
  const [showTranslation, setShowTranslation] = useState(false);
  
  // Find the rider based on the request
  useEffect(() => {
    const matchedRider = mockNearbyRiders.find(r => r.id === request.riderId);
    if (matchedRider) {
      setRider(matchedRider);
    }
  }, [request]);
  
  // Countdown timer (only before acceptance)
  useEffect(() => {
    if (isAccepted) return;
    
    if (timeLeft <= 0) {
      onDecline(request.id);
      toast({
        title: "Request expired",
        description: "The ride request has expired",
        variant: "destructive",
      });
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onDecline, request.id, toast, isAccepted]);
  
  const handleAccept = () => {
    onAccept(request.id);
    toast({
      title: "Ride accepted!",
      description: "You've successfully accepted the ride",
    });
  };
  
  const handleDecline = () => {
    onDecline(request.id);
    toast({
      description: "Ride request declined",
    });
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div className={cn(
        "bg-white rounded-xl shadow-elevated animate-slide-up transition-all duration-300 overflow-hidden relative",
        isFullScreen ? "fixed inset-0 z-50" : "mx-auto max-w-md"
      )}>
        {isFullScreen && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <div className="bg-driver-primary text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                {isAccepted ? "Active Ride" : "New Ride Request"}
              </h2>
              {!isAccepted && (
                <p className="text-sm opacity-90">Expires in {timeLeft} seconds</p>
              )}
            </div>
            <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-full h-10 w-10">
              <Navigation className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white border-opacity-20 flex">
            <div className="flex-1 flex items-center">
              <Clock className="h-4 w-4 mr-2 opacity-90" />
              <span className="text-sm">{formatDuration(request.estimatedDuration)}</span>
            </div>
            <div className="flex-1 flex items-center">
              <MapPin className="h-4 w-4 mr-2 opacity-90" />
              <span className="text-sm">{formatDistance(request.estimatedDistance)}</span>
            </div>
            <div className="flex-1 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 opacity-90" />
              <span className="text-sm">{formatPrice(request.estimatedPrice)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start">
            <div className="mr-3 flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Pickup Location</div>
                <div className="font-medium">{request.pickupLocation.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Drop Location</div>
                <div className="font-medium">{request.dropLocation.address}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 mr-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-driver-primary font-bold mr-3">
                  {rider?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{rider?.name}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" /> 
                    {rider?.rating} Rating
                  </div>
                </div>
              </div>
              {!isAccepted && rider?.needsTranslation && (
                <div className="flex items-center space-x-3">
                  <button 
                    className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors"
                    onClick={() => setShowTranslation(true)}
                  >
                    <Languages className="h-5 w-5" />
                  </button>
                  <button 
                    className="bg-green-50 text-green-600 p-2 rounded-full hover:bg-green-100 transition-colors"
                    onClick={() => toast({ description: "Calling rider..." })}
                  >
                    <PhoneCall className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <button 
            className="w-full flex items-center justify-center text-sm text-gray-500 mt-4 pt-2"
            onClick={toggleDetails}
          >
            {showDetails ? (
              <>Hide details <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show details <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </button>
          
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-sm animate-fade-in">
              <div className="flex justify-between">
                <span className="text-gray-500">Base Fare</span>
                <span>₹30.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Distance ({request.estimatedDistance} km)</span>
                <span>₹{request.estimatedDistance * 15}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Waiting Charge</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-dashed border-gray-200 mt-2">
                <span>Total Fare</span>
                <span>{formatPrice(request.estimatedPrice)}</span>
              </div>
            </div>
          )}
          
          {!isAccepted && (
            <>
              <div className="flex space-x-3 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
                <Button 
                  className="flex-1 bg-driver-primary hover:bg-driver-primary/90"
                  onClick={handleAccept}
                >
                  Accept
                </Button>
              </div>
              
              <div className="mt-3 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-driver-primary h-full" 
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Translation Modal */}
      {showTranslation && (
        <div className="fixed inset-0 z-[9999]">
          <TranslationModal
            onClose={() => setShowTranslation(false)}
            riderPhone={rider?.phoneNumber}
          />
        </div>
      )}
    </>
  );
};

export default RideRequest;
