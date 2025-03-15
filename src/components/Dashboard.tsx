
import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Map, Navigation, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { mockCurrentDriver, mockRecentRides, mockWeeklyEarnings } from "@/data/mockData";
import { formatPrice, formatDistance, formatDuration } from "@/utils/calculationUtils";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("week");
  
  // Calculate total earnings for selected period
  const getTotalEarnings = () => {
    if (selectedPeriod === "today") return 850;
    if (selectedPeriod === "week") return mockWeeklyEarnings.reduce((acc, day) => acc + day.amount, 0);
    if (selectedPeriod === "month") return 32500;
    return 0;
  };
  
  // Calculate total rides for selected period
  const getTotalRides = () => {
    if (selectedPeriod === "today") return 7;
    if (selectedPeriod === "week") return mockWeeklyEarnings.reduce((acc, day) => acc + day.rides, 0);
    if (selectedPeriod === "month") return 265;
    return 0;
  };
  
  const totalEarnings = getTotalEarnings();
  const totalRides = getTotalRides();
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-driver-primary to-driver-secondary p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {mockCurrentDriver.name.split(' ')[0]}!</h1>
            <p className="opacity-90">Ready to earn today? Check your progress and find rides.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              to="/ride-selection" 
              className="inline-flex items-center justify-center bg-white text-driver-primary font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Map className="mr-2 h-4 w-4" />
              Find Riders
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Earnings</p>
                <h3 className="text-2xl font-bold">{formatPrice(totalEarnings)}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-driver-primary">
                <BarChart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Rides</p>
                <h3 className="text-2xl font-bold">{totalRides}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Navigation className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Online Hours</p>
                <h3 className="text-2xl font-bold">26.5 hrs</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Earnings Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Track your earnings and rides over time</CardDescription>
            </div>
            <Tabs
              defaultValue="week"
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as "today" | "week" | "month")}
              className="mt-2 md:mt-0"
            >
              <TabsList className="grid w-full grid-cols-3 max-w-[240px]">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={mockWeeklyEarnings}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `₹${value}`} 
                width={50}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, "Earnings"]} 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                }}
              />
              <Bar 
                dataKey="amount" 
                radius={[4, 4, 0, 0]} 
                fill="#247AFF" 
                barSize={36} 
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Recent Rides */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Rides</CardTitle>
            <Link 
              to="/ride-history" 
              className="text-sm font-medium text-driver-primary flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <CardDescription>Your last few completed rides</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {mockRecentRides.map((ride) => (
              <div 
                key={ride.id} 
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-driver-primary bg-opacity-10 rounded-full flex items-center justify-center text-driver-primary">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      {ride.pickupLocation.address.split(',')[0]} to {ride.dropLocation.address.split(',')[0]}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="inline-block">{formatDistance(ride.distance)}</span>
                      <span className="mx-2">•</span>
                      <span className="inline-block">{formatDuration(ride.duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-driver-dark">{formatPrice(ride.price)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(ride.completedAt!).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Tips and Insights */}
      <Card className="bg-amber-50 border border-amber-100">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Earnings Tip</h3>
              <p className="text-amber-700 text-sm mt-1">
                Area demand is high in Indiranagar and Koramangala between 6 PM - 9 PM today. Head there to maximize your earnings!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
