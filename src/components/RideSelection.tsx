import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

// Load Google Maps types
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyAtxaaw2GuXURkOtr6cq0Kzd_Tw-e8Xogw";

const RideSelection = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 12.9716,  // Default to Bangalore coordinates
    lng: 77.5946
  });

  // Initialize map when the component mounts
  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly"
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      try {
        const mapOptions = {
          center: currentLocation,
          zoom: 14,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);

        // Add marker for current location
        new google.maps.Marker({
          position: currentLocation,
          map: newMap,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#247AFF",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: "Your Location"
        });

        console.log("Map initialized successfully");
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }).catch((error) => {
      console.error("Error loading Google Maps:", error);
    });

    return () => {
      // Cleanup
      if (map) {
        // @ts-ignore - TypeScript doesn't know about this method
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          
          // Update map center if map exists
          if (map) {
            map.setCenter(newLocation);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [map]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Map Container */}
      <div className="flex-1 relative w-full h-full">
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>

      {/* Sidebar */}
      <Card className="w-96 h-full rounded-none shadow-xl overflow-auto">
        <CardHeader className="sticky top-0 bg-white z-10">
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-driver-primary" />
            <span>Find Rides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-driver-primary bg-opacity-10 rounded-full flex items-center justify-center text-driver-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Your Location</p>
                  <p className="font-medium">
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 py-8">
              <p>Looking for ride requests in your area...</p>
              <p className="text-sm mt-2">Stay online to receive ride requests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideSelection; 