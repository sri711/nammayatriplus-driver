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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4">
      {/* Event Alert */}
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-100 shadow-lg transform hover:scale-[1.01] transition-all">
        <CardContent className="p-8">
          <div className="flex space-x-6">
            <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
            </div>
            <div>
              <h3 className="font-bold text-purple-900 text-xl mb-2">High Demand: {highDemandLocation.area}</h3>
              <p className="text-purple-800 text-base leading-relaxed">
                Major surge expected around {highDemandLocation.area} ({highDemandLocation.startTime} - {highDemandLocation.endTime}). High demand and surge pricing likely. Position yourself nearby for maximum rides.
              </p>
              <div className="flex items-center mt-4 text-sm text-purple-700 bg-purple-50/50 rounded-lg p-2">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Expected Duration: {highDemandLocation.expectedDuration}</span>
                <span className="mx-3 text-purple-300">|</span>
                <Map className="h-5 w-5 mr-2" />
                <span className="font-medium">{highDemandLocation.area}, Bengaluru</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-br from-driver-primary via-blue-600 to-driver-secondary p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-left space-y-2">
              <h1 className="text-3xl font-bold text-left tracking-tight">Welcome back, {mockCurrentDriver.name.split(' ')[0]}!</h1>
              <p className="text-left text-white/90 text-lg">Ready to earn today? Check your progress and find rides.</p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <Link 
              to="/ride-selection" 
              className="inline-flex items-center justify-center bg-white text-driver-primary font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Map className="mr-2 h-5 w-5" />
              Find Riders
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Earnings</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-driver-primary bg-clip-text text-transparent">{formatPrice(totalEarnings)}</h3>
              </div>
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center text-driver-primary shadow-inner">
                <BarChart className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Rides</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">{totalRides}</h3>
              </div>
              <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
                <Navigation className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Projected Earnings</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">{formatPrice(projectedEarnings)}</h3>
                <p className="text-xs text-green-600 mt-2 font-medium">Based on {selectedPeriod}ly average</p>
              </div>
              <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-inner">
                <DollarSign className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Earnings Chart */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2 px-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-left space-y-1">
              <CardTitle className="text-xl font-bold">Earnings Overview</CardTitle>
              <CardDescription className="text-base">Track your earnings and rides over time</CardDescription>
            </div>
            <Tabs
              defaultValue="week"
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as "today" | "week" | "month")}
              className="mt-4 md:mt-0"
            >
              <TabsList className="grid w-full grid-cols-3 max-w-[280px] p-1 bg-gray-100/80">
                <TabsTrigger value="today" className="font-medium">Today</TabsTrigger>
                <TabsTrigger value="week" className="font-medium">Week</TabsTrigger>
                <TabsTrigger value="month" className="font-medium">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6 h-72 px-4">
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
                tick={{ fontSize: 12, fill: '#64748b' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickFormatter={(value) => `₹${value}`} 
                width={50}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, "Earnings"]} 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar 
                dataKey="amount" 
                radius={[6, 6, 0, 0]} 
                fill="#247AFF" 
                barSize={40} 
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Event Analysis */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-blue-100 shadow-lg">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="flex items-center text-xl font-bold">
            <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
            Event Analysis
          </CardTitle>
          <CardDescription className="text-base ml-9">Upcoming high-demand events and peak times</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* High Demand Events */}
            <div>
              <h4 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wide">High Demand Events</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "2025 Men's BET",
                  "Madison Square Garden Tour Experience",
                  "Candy Crafting at Cricket's Candy Creations",
                  "The Rock and Roll Playhouse plays the Music of Tom Petty + More!",
                  "Ferrytale of New York A Saint Patrick's Afternoon Eve Booze Cruise",
                  "The World Famous Harlem Gospel Choir"
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/80 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-3 w-3 bg-blue-500 rounded-full ring-4 ring-blue-100"></div>
                    <span className="text-sm font-medium text-blue-900">{event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Times and Volume */}
            <div>
              <h4 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wide">Peak Times & Estimated Volume</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-blue-600">4,000+</div>
                  <div className="text-sm font-medium text-blue-800 mt-1">Peak Volume at 16:00</div>
                </div>
                <div className="bg-white/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-blue-600">4,000+</div>
                  <div className="text-sm font-medium text-blue-800 mt-1">Peak Volume at 18:00</div>
                </div>
                <div className="bg-white/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-blue-600">2,000+</div>
                  <div className="text-sm font-medium text-blue-800 mt-1">Average Other Hours</div>
                </div>
              </div>
            </div>

            {/* Time Distribution */}
            <div className="bg-white/80 p-5 rounded-xl shadow-sm">
              <h4 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wide">Time Distribution</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-3 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded-full">Peak Hours: 16:00-18:00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pro Tips */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-lg">
        <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
          <Star className="h-6 w-6" />
        </div>
        <p className="text-base font-medium text-green-800 leading-relaxed">
          Pro drivers maintain: route adherence {'>'} 95%, phone distractions {'<'} 0.1/trip, idle time {'<'} 1.5min/trip, ratings {'>'} 4.8/5
        </p>
      </div>
      
      {/* Leaderboard */}
      <Card className="shadow-lg">
        <CardHeader className="pb-0 px-6 pt-6">
          <div className="flex items-start">
            <div>
              <CardTitle className="flex items-center text-xl font-bold">
                <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
                Driver Leaderboard
              </CardTitle>
              <CardDescription className="text-base ml-9">Top performing drivers in your area</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          <div className="space-y-4">
            {mockLeaderboard.map((driver) => (
              <div 
                key={driver.id}
                className={cn(
                  "flex items-start justify-between p-4 rounded-xl transition-all",
                  driver.id === mockCurrentDriver.id ? "bg-blue-50 shadow-md" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-start">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-4 shadow-inner flex-shrink-0",
                    driver.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    driver.rank === 2 ? "bg-gray-100 text-gray-700" :
                    driver.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-blue-50 text-blue-700"
                  )}>
                    {driver.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-left">
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
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="font-semibold text-gray-900">{driver.ridesThisMonth}</div>
                  <div className="text-xs text-gray-500 mt-1">Rides this month</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Rides */}
      <Card className="shadow-lg">
        <CardHeader className="pb-0 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Recent Rides</CardTitle>
              <CardDescription className="text-base">Your last few completed rides</CardDescription>
            </div>
            <Link 
              to="/ride-history" 
              className="text-sm font-medium text-driver-primary flex items-center hover:text-driver-primary/80 transition-colors"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          <div className="space-y-5">
            {mockRecentRides.map((ride) => (
              <div 
                key={ride.id} 
                className="flex items-center justify-between border-b border-gray-100 pb-5 last:border-0 hover:bg-gray-50/50 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-driver-primary bg-opacity-10 rounded-xl flex items-center justify-center text-driver-primary shadow-inner">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {ride.pickupLocation.address.split(',')[0]} to {ride.dropLocation.address.split(',')[0]}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="inline-block">{formatDistance(ride.distance)}</span>
                      <span className="mx-2">•</span>
                      <span className="inline-block">{formatDuration(ride.duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatPrice(ride.price)}</div>
                  <div className="text-sm text-gray-500 mt-1">
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
