
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Locate, Layers, ZoomIn, ZoomOut, Navigation, MapPin } from "lucide-react";
import { mockCurrentDriver, mockNearbyRiders, Rider } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { calculateDistance } from "@/utils/calculationUtils";
 
// This is a mock map component since we can't use actual Google Maps in this sandbox
// In a real implementation, you would use Google Maps JavaScript API
const Map = ({ 
  showNearbyRiders = false,
  destination = null,
  onRiderSelect = null,
  className
}: { 
  showNearbyRiders?: boolean;
  destination?: { latitude: number; longitude: number; address: string } | null;
  onRiderSelect?: ((rider: Rider) => void) | null;
  className?: string;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [zoomLevel, setZoomLevel] = useState(14);
  
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 1, 20)); 
  };
  
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 1, 1));
  };
  
  const handleMapTypeToggle = () => {
    setMapType(mapType === "standard" ? "satellite" : "standard");
  };
  
  const handleRiderClick = (rider: Rider) => {
    setSelectedRider(rider);
    if (onRiderSelect) {
      onRiderSelect(rider);
    }
  };
  
  const handleCenterMap = () => {
    // In a real implementation, this would center the map on the driver's location
    console.log("Centering map on current location");
  };
  
  // Sort riders by distance from driver
  const sortedRiders = [...mockNearbyRiders].sort((a, b) => {
    const distanceA = calculateDistance(
      mockCurrentDriver.location.latitude,
      mockCurrentDriver.location.longitude,
      a.location.latitude,
      a.location.longitude
    );
    const distanceB = calculateDistance(
      mockCurrentDriver.location.latitude,
      mockCurrentDriver.location.longitude,
      b.location.latitude,
      b.location.longitude
    );
    return distanceA - distanceB;
  });
  
  return (
    <div className={cn("relative rounded-xl overflow-hidden h-[400px]", className)}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={cn(
          "w-full h-full", 
          mapType === "standard" ? "bg-blue-50" : "bg-gray-800"
        )}
        style={{
          backgroundImage: mapType === "standard" 
            ? "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,12,0/800x800?access_token=pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNrZHhjcW4weTB4bjAydGtsNTVmbDYwejMifQ.mLg1i3WXtExaH9ycN9HJ8Q')" 
            : "url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/77.5946,12.9716,12,0/800x800?access_token=pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNrZHhjcW4weTB4bjAydGtsNTVmbDYwejMifQ.mLg1i3WXtExaH9ycN9HJ8Q')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Stylized representation of the driver's position */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
          <div className="relative">
            <div className="w-6 h-6 bg-driver-primary rounded-full flex items-center justify-center">
              <Navigation className="h-3 w-3 text-white" />
            </div>
            <div className="absolute top-0 left-0 w-6 h-6 bg-driver-primary rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        
        {/* Destination marker */}
        {destination && (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: "60%", top: "40%" }}>
            <div className="flex flex-col items-center">
              <MapPin className="h-6 w-6 text-red-500" />
              <div className="bg-white px-2 py-1 rounded text-xs font-medium shadow mt-1 whitespace-nowrap">
                {destination.address.split(',')[0]}
              </div>
            </div>
          </div>
        )}
        
        {/* Nearby riders */}
        {showNearbyRiders && sortedRiders.map((rider, index) => {
          // Position riders at different locations on the map (for demo purposes)
          const positions = [
            { left: "40%", top: "45%" },
            { left: "60%", top: "55%" },
            { left: "45%", top: "60%" },
          ];
          const position = positions[index % positions.length];
          
          return (
            <div 
              key={rider.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: position.left, top: position.top }}
              onClick={() => handleRiderClick(rider)}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white",
                  selectedRider?.id === rider.id ? "bg-green-500" : "bg-driver-secondary"
                )}>
                  {rider.name.charAt(0)}
                </div>
                {selectedRider?.id === rider.id && (
                  <div className="bg-white px-2 py-0.5 rounded text-xs font-medium shadow mt-1">
                    {calculateDistance(
                      mockCurrentDriver.location.latitude,
                      mockCurrentDriver.location.longitude,
                      rider.location.latitude,
                      rider.location.longitude
                    ).toFixed(1)} km
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Route representation (for when there's a destination) */}
        {destination && (
          <div className="absolute left-1/2 top-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path 
                d="M50,50 C50,30 70,40 80,20" 
                stroke="#247AFF" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="6,3" 
                fill="none" 
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-white shadow-md"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-white shadow-md"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-white shadow-md"
          onClick={handleMapTypeToggle}
        >
          <Layers className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-white shadow-md"
          onClick={handleCenterMap}
        >
          <Locate className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Map Attribution (would be required with real map APIs) */}
      <div className="absolute bottom-1 right-1 text-[8px] text-gray-500 bg-white bg-opacity-70 px-1 rounded">
        Map data © Demo Map
      </div>
    </div>
  );
};

export default Map;
