import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Map, Navigation, Clock, AlertCircle, ChevronRight, DollarSign, Trophy, Star } from "lucide-react";
import { mockCurrentDriver, mockRecentRides, mockWeeklyEarnings, mockLeaderboard, highDemandLocation } from "@/data/mockData";
import { formatPrice, formatDistance, formatDuration } from "@/utils/calculationUtils";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

  // Calculate projected earnings
  const getProjectedEarnings = (period: "today" | "week" | "month") => {
    const weeklyData = mockWeeklyEarnings;
    const avgDailyEarnings = weeklyData.reduce((acc, day) => acc + day.amount, 0) / weeklyData.length;
    const avgRidesPerDay = weeklyData.reduce((acc, day) => acc + day.rides, 0) / weeklyData.length;
    const avgEarningsPerRide = avgDailyEarnings / avgRidesPerDay;

    switch (period) {
      case "today":
        return Math.round(avgDailyEarnings * 1.1); // 10% growth projection
      case "week":
        return Math.round(avgDailyEarnings * 7 * 1.15); // 15% growth projection
      case "month":
        return Math.round(avgDailyEarnings * 30 * 1.2); // 20% growth projection
      default:
        return 0;
    }
  };

  // Prepare chart data with projections
  const getChartData = () => {
    const weeklyData = mockWeeklyEarnings;
    const avgDailyEarnings = weeklyData.reduce((acc, day) => acc + day.amount, 0) / weeklyData.length;
    
    return weeklyData.map((day, index) => {
      const growthFactor = 1 + (0.15 * (index / weeklyData.length)); // Gradual increase in growth rate
      const projectedAmount = Math.round(avgDailyEarnings * growthFactor);
      
      return {
        ...day,
        projectedAmount,
      };
    });
  };
  
  const totalEarnings = getTotalEarnings();
  const totalRides = getTotalRides();
  const projectedEarnings = getProjectedEarnings(selectedPeriod);
  const chartData = getChartData();
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Event Alert */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 text-lg">High Demand: {highDemandLocation.area}</h3>
              <p className="text-purple-800 mt-1">
                Major surge expected around {highDemandLocation.area} ({highDemandLocation.startTime} - {highDemandLocation.endTime}). High demand and surge pricing likely. Position yourself nearby for maximum rides.
              </p>
              <div className="flex items-center mt-2 text-sm text-purple-700">
                <Clock className="h-4 w-4 mr-1" />
                <span>Expected Duration: {highDemandLocation.expectedDuration}</span>
                <span className="mx-2">•</span>
                <Map className="h-4 w-4 mr-1" />
                <span>{highDemandLocation.area}, Bengaluru</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-driver-primary to-driver-secondary p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-left">Welcome back, {mockCurrentDriver.name.split(' ')[0]}!</h1>
              <p className="text-left mt-2">Ready to earn today? Check your progress and find rides.</p>
            </div>
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
                <p className="text-sm font-medium text-muted-foreground mb-1">Projected Earnings</p>
                <h3 className="text-2xl font-bold">{formatPrice(projectedEarnings)}</h3>
                <p className="text-xs text-green-600 mt-1">Based on {selectedPeriod}ly average</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Earnings Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="text-left">
              <CardTitle className="text-left">Earnings Overview</CardTitle>
              <CardDescription className="text-left">Track your earnings and rides over time</CardDescription>
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
      
      {/* Pro Tips */}
      <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
        <Star className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-base text-green-800">
          Pro drivers maintain: route adherence {'>'} 95%, phone distractions {'<'} 0.1/trip, idle time {'<'} 1.5min/trip, ratings {'>'} 4.8/5
        </p>
      </div>
      
      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Driver Leaderboard
              </CardTitle>
              <CardDescription>Top performing drivers in your area</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {mockLeaderboard.map((driver) => (
              <div 
                key={driver.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg transition-colors",
                  driver.id === mockCurrentDriver.id ? "bg-blue-50" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center flex-1">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4",
                    driver.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    driver.rank === 2 ? "bg-gray-100 text-gray-700" :
                    driver.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-blue-50 text-blue-700"
                  )}>
                    {driver.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-left">
                      {driver.name}
                      {driver.id === mockCurrentDriver.id && " (You)"}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {driver.rating}
                      </span>
                      <span className="mx-2">•</span>
                      <span>All time: {driver.ridesCompleted} rides</span>
                    </div>
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="font-medium text-gray-900">{driver.ridesThisMonth}</div>
                  <div className="text-xs text-gray-500 mt-1">Rides this month</div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default Dashboard;
