
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, Navigation, MapPin } from "lucide-react";
import { mockRideRequests, RideRequest, Rider } from "@/data/mockData";
import { formatPrice, formatDistance, formatDuration } from "@/utils/calculationUtils";
import Layout from "@/components/Layout";
import Map from "@/components/Map";
import RideRequestComponent from "@/components/RideRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const RideSelection = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState([...mockRideRequests]);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  
  const handleRiderSelect = (rider: Rider) => {
    setSelectedRider(rider);
    const matchedRequest = requests.find(req => req.riderId === rider.id);
    if (matchedRequest) {
      setSelectedRequest(matchedRequest);
      setShowRequestDetails(true);
    }
  };
  
  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would call an API to accept the request
    setRequests(requests.filter(req => req.id !== requestId));
    setShowRequestDetails(false);
    toast({
      title: "Ride Accepted!",
      description: "Navigate to pick up the rider",
    });
    // In a real app, this would navigate to the active ride page
  };
  
  const handleDeclineRequest = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
    setShowRequestDetails(false);
  };
  
  const handleRequestClick = (request: RideRequest) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };
  
  return (
    <Layout fullWidth className="p-0">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm z-10 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-3">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Find Riders</h1>
          </div>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        {/* Map Section */}
        <div className="flex-grow relative">
          <Map 
            showNearbyRiders={true} 
            onRiderSelect={handleRiderSelect}
            className="h-full"
          />
          
          {/* Bottom Card with Requests */}
          <div className="absolute bottom-0 left-0 right-0">
            <Card className="mx-4 mb-4 shadow-elevated overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="font-medium">Nearby Ride Requests</h2>
              </div>
              <CardContent className="p-0 max-h-[250px] overflow-y-auto">
                {requests.length > 0 ? (
                  <div className="divide-y">
                    {requests.map((request) => (
                      <div 
                        key={request.id}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleRequestClick(request)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex">
                            <div className="mr-3 flex flex-col items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div>
                              <div className="text-sm mb-1">{request.pickupLocation.address.split(',')[0]}</div>
                              <div className="text-sm">{request.dropLocation.address.split(',')[0]}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(request.estimatedPrice)}</div>
                            <div className="text-xs text-gray-500 mt-1">{formatDistance(request.estimatedDistance)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No ride requests nearby</p>
                    <p className="text-sm text-gray-400 mt-1">Try again in a few moments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <RideRequestComponent
            request={selectedRequest}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onClose={() => setShowRequestDetails(false)}
            isFullScreen={false}
          />
        </div>
      )}
    </Layout>
  );
};

export default RideSelection;
