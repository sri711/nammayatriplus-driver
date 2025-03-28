import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Debug logging
console.log('Environment check:', {
  apiKeyExists: !!GOOGLE_MAPS_API_KEY,
  apiKeyValue: GOOGLE_MAPS_API_KEY
});

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is missing. Please check your .env file.');
}

const RideSelection = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 12.9716,  // Default to Bangalore coordinates
    lng: 77.5946
  });

  // Initialize map when the component mounts
  useEffect(() => {
    const initMap = async () => {
      console.log('Starting map initialization...');
      
      if (!GOOGLE_MAPS_API_KEY) {
        console.error('No API key available');
        setError('Google Maps API key is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading Google Maps script...');
        // Load the Google Maps script
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
          language: "en",
          region: "IN"
        });

        console.log('Awaiting Google Maps script load...');
        const google = await loader.load();
        console.log('Google Maps script loaded successfully');
        
        if (!mapRef.current) {
          throw new Error("Map container not found");
        }

        // Check if the Google Maps API is loaded correctly
        if (!google || !google.maps) {
          throw new Error("Google Maps API failed to load");
        }

        console.log('Creating map instance...');
        const mapOptions: google.maps.MapOptions = {
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
          fullscreenControl: true,
          gestureHandling: "greedy"
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        console.log('Map instance created');
        setMap(newMap);

        // Add marker for current location
        console.log('Adding current location marker...');
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
        setError(error instanceof Error ? error.message : "Failed to load map");
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (!map) return;

    console.log('Getting user location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location received:', position.coords);
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          
          // Update map center and marker
          map.setCenter(newLocation);
          
          // Clear existing markers
          map.data.forEach((feature) => {
            map.data.remove(feature);
          });

          // Add new marker
          new google.maps.Marker({
            position: newLocation,
            map: map,
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
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get your current location. Using default location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Using default location.");
    }
  }, [map]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Map Container */}
      <div className="flex-1 relative w-full h-full">
        <div 
          ref={mapRef} 
          className="absolute inset-0 bg-gray-100"
          style={{ 
            width: '100%', 
            height: '100%'
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-driver-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
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