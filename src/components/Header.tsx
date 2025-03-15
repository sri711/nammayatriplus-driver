import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Bell, Menu, X, MapPin, Home, Car, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCurrentDriver } from "@/data/mockData";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [messages, setMessages] = useState(1);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const isCurrentPath = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/ride-selection", label: "Find Rides", icon: MapPin },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-driver-primary font-bold text-2xl">Yatri</span>
            <span className="bg-driver-primary text-white text-xs rounded-md px-1.5 py-0.5">Driver</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center text-sm px-3 py-2 rounded-md transition-all",
                isCurrentPath(item.path) 
                  ? "bg-driver-primary text-white font-medium" 
                  : "text-driver-text hover:bg-gray-100"
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 text-driver-muted" />
              {messages > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-driver-primary rounded-full">
                  {messages}
                </span>
              )}
            </button>
          </div>
          
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-driver-muted" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-driver-primary rounded-full">
                  {notifications}
                </span>
              )}
            </button>
          </div>
          
          <div className="relative flex items-center">
            <Link to="/profile">
              <button className="online-status flex items-center py-1.5 rounded-full pl-1 pr-3 bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="relative">
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {mockCurrentDriver.name.charAt(0)}
                  </div>
                  <span className={cn(
                    "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                    mockCurrentDriver.isOnline ? "bg-driver-success" : "bg-gray-400"
                  )}></span>
                </span>
                <span className="ml-2 text-xs font-medium hidden sm:block">
                  {mockCurrentDriver.name.split(" ")[0]}
                </span>
              </button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={closeMenu}>
          <div 
            className="absolute right-0 top-0 h-screen w-64 bg-white shadow-xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-driver-primary font-bold">
                    {mockCurrentDriver.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{mockCurrentDriver.name}</div>
                    <div className="text-xs text-driver-muted">{mockCurrentDriver.phoneNumber}</div>
                  </div>
                </div>
              </div>
              
              <nav className="py-2 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 hover:bg-gray-50",
                      isCurrentPath(item.path) && "text-driver-primary font-medium bg-blue-50"
                    )}
                    onClick={closeMenu}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Online Status</span>
                  <div 
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                      mockCurrentDriver.isOnline ? "bg-driver-success" : "bg-gray-200"
                    )}
                  >
                    <span 
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        mockCurrentDriver.isOnline ? "translate-x-5" : "translate-x-0"
                      )} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
