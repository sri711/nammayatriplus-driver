
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Navigation, Clock, DollarSign, MapPin, ChevronDown, ChevronUp, X } from "lucide-react";
import { Ride, mockCurrentDriver } from "@/data/mockData";
import { formatPrice, formatDistance, formatDuration } from "@/utils/calculationUtils";
import Layout from "@/components/Layout";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock active ride data
const mockActiveRide: Ride = {
  id: "active-001",
  riderId: "r-001",
  driverId: "d-001",
  pickupLocation: {
    latitude: 12.9719,
    longitude: 77.5942,
    address: "Cubbon Park, Bengaluru",
  },
  dropLocation: {
    latitude: 12.9780,
    longitude: 77.6080,
    address: "Indiranagar, Bengaluru",
  },
  distance: 5.8,
  price: 130,
  duration: 22,
  status: "ACCEPTED",
  startedAt: new Date().toISOString(),
};

const ActiveRide = () => {
  const { toast } = useToast();
  const [activeRide, setActiveRide] = useState<Ride>(mockActiveRide);
  const [rideStatus, setRideStatus] = useState<"ACCEPTED" | "STARTED" | "COMPLETED">(
    mockActiveRide.status as "ACCEPTED"
  );
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    // Simulate countdown to pickup/destination
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleStartRide = () => {
    setRideStatus("STARTED");
    setTimeLeft(mockActiveRide.duration * 60); // Convert minutes to seconds
    toast({
      description: "Ride started! Navigate to the destination.",
    });
  };

  const handleCompleteRide = () => {
    setRideStatus("COMPLETED");
    toast({
      title: "Ride completed!",
      description: `You've earned ${formatPrice(activeRide.price)}`,
    });
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <Layout fullWidth className="p-0">
      <div className="flex flex-col h-screen">
        {/* Status Bar */}
        <div className="bg-driver-primary text-white p-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold">
                {rideStatus === "ACCEPTED" ? "Picking up rider" : "Navigating to destination"}
              </h1>
              <p className="text-sm opacity-90">
                {rideStatus === "ACCEPTED" ? "Arrival in " : "Reach destination in "}
                {formatTimeLeft()}
              </p>
            </div>
            <Link to="/ride-selection">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-driver-primary/90"
              >
                <X className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Map Section */}
        <div className="flex-grow relative">
          <Map
            destination={
              rideStatus === "ACCEPTED"
                ? activeRide.pickupLocation
                : activeRide.dropLocation
            }
            className="h-full"
          />
        </div>

        {/* Bottom Card */}
        <Card className="rounded-b-none border-b-0 shadow-elevated">
          <CardContent className="p-4 pt-6 pb-8">
            {/* Handle Bar */}
            <div className="absolute top-2 left-0 right-0 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Rider Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-driver-primary font-bold mr-3">
                  A
                </div>
                <div>
                  <div className="font-medium">Amit Sharma</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>4.7 ★</span>
                  </div>
                </div>
              </div>
              <button
                className="bg-green-50 text-green-600 p-2 rounded-full"
                onClick={() => toast({ description: "Calling rider..." })}
              >
                <PhoneCall className="h-5 w-5" />
              </button>
            </div>

            {/* Location Info */}
            <div className="flex items-start mb-4">
              <div className="mr-3 flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Pickup</div>
                  <div className="font-medium">{activeRide.pickupLocation.address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Destination</div>
                  <div className="font-medium">{activeRide.dropLocation.address}</div>
                </div>
              </div>
            </div>

            {/* Toggle Details Button */}
            <button
              className="w-full flex items-center justify-center text-sm text-gray-500 mt-4"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <>Hide details <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>Show details <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </button>

            {/* Extra Details */}
            {showDetails && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-sm animate-fade-in">
                <div className="flex justify-between">
                  <span className="text-gray-500">Distance</span>
                  <span>{formatDistance(activeRide.distance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span>{formatDuration(activeRide.duration)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-dashed border-gray-200 mt-2">
                  <span>Total Fare</span>
                  <span>{formatPrice(activeRide.price)}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            {rideStatus === "ACCEPTED" ? (
              <Button
                className="w-full mt-4 bg-driver-primary hover:bg-driver-primary/90"
                onClick={handleStartRide}
              >
                Start Ride
              </Button>
            ) : rideStatus === "STARTED" ? (
              <Button
                className="w-full mt-4 bg-driver-primary hover:bg-driver-primary/90"
                onClick={handleCompleteRide}
              >
                Complete Ride
              </Button>
            ) : (
              <Link to="/ride-selection" className="block w-full">
                <Button className="w-full mt-4 bg-driver-primary hover:bg-driver-primary/90">
                  Find New Ride
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ActiveRide;
