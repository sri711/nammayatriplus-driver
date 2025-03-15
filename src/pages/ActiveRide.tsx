import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Navigation, Clock, DollarSign, MapPin, ChevronDown, ChevronUp, X } from "lucide-react";
import { Ride, RideRequest as RideRequestType, mockCurrentDriver } from "@/data/mockData";
import { formatPrice, formatDistance, formatDuration } from "@/utils/calculationUtils";
import Layout from "@/components/Layout";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import RideRequest from "@/components/RideRequest";

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
    setActiveRide(prev => ({ ...prev, status: "STARTED" }));
    toast({
      description: "Ride started! Navigate to the destination.",
    });
  };

  const handleCompleteRide = () => {
    setRideStatus("COMPLETED");
    setActiveRide(prev => ({ ...prev, status: "COMPLETED" }));
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

  // Convert activeRide to RideRequest type
  const rideRequest: RideRequestType = {
    id: activeRide.id,
    riderId: activeRide.riderId,
    pickupLocation: activeRide.pickupLocation,
    dropLocation: activeRide.dropLocation,
    estimatedDistance: activeRide.distance,
    estimatedPrice: activeRide.price,
    estimatedDuration: activeRide.duration,
    status: activeRide.status,
    createdAt: activeRide.startedAt || new Date().toISOString()
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen relative">
        {/* Status Bar */}
        <div className="bg-driver-primary text-white p-4 z-30">
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

        {/* Map */}
        <div className="flex-1 relative z-10">
          <Map
            destination={
              rideStatus === "ACCEPTED"
                ? rideRequest.pickupLocation
                : rideRequest.dropLocation
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          {rideStatus === "ACCEPTED" && (
            <Button
              className="w-full bg-driver-primary hover:bg-driver-primary/90"
              onClick={handleStartRide}
            >
              Start Ride
            </Button>
          )}
          {rideStatus === "STARTED" && (
            <Button
              className="w-full bg-driver-primary hover:bg-driver-primary/90"
              onClick={handleCompleteRide}
            >
              Complete Ride
            </Button>
          )}
          {rideStatus === "COMPLETED" && (
            <Link to="/ride-selection" className="block w-full">
              <Button className="w-full bg-driver-primary hover:bg-driver-primary/90">
                Find New Ride
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ActiveRide;
