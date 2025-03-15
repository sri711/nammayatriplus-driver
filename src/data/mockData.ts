
// Driver data
export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  rating: number;
  totalRides: number;
  totalEarnings: number;
  isOnline: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  vehicle?: Vehicle;
}

// Vehicle data
export interface Vehicle {
  id: string;
  type: 'AUTO' | 'BIKE' | 'CAR';
  model: string;
  registrationNumber: string;
  color?: string;
}

// Rider data
export interface Rider {
  id: string;
  name: string;
  phoneNumber: string;
  rating: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

// Ride request data
export interface RideRequest {
  id: string;
  riderId: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedDistance: number; // in kilometers
  estimatedPrice: number;
  estimatedDuration: number; // in minutes
  status: 'PENDING' | 'ACCEPTED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

// Ride data
export interface Ride {
  id: string;
  riderId: string;
  driverId: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance: number; // in kilometers
  price: number;
  duration: number; // in minutes
  status: 'ACCEPTED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  riderRating?: number;
  driverRating?: number;
}

// Mock current driver
export const mockCurrentDriver: Driver = {
  id: "d-001",
  name: "Rajesh Kumar",
  phoneNumber: "+91 98765 43210",
  rating: 4.8,
  totalRides: 856,
  totalEarnings: 156430,
  isOnline: true,
  location: {
    latitude: 12.9716,
    longitude: 77.5946,
  },
  vehicle: {
    id: "v-001",
    type: "AUTO",
    model: "Bajaj RE",
    registrationNumber: "KA 01 AB 1234",
    color: "Yellow"
  }
};

// Mock riders nearby
export const mockNearbyRiders: Rider[] = [
  {
    id: "r-001",
    name: "Amit Sharma",
    phoneNumber: "+91 98765 12345",
    rating: 4.7,
    location: {
      latitude: 12.9719,
      longitude: 77.5942,
    },
  },
  {
    id: "r-002",
    name: "Priya Patel",
    phoneNumber: "+91 87654 32109",
    rating: 4.9,
    location: {
      latitude: 12.9721,
      longitude: 77.5948,
    },
  },
  {
    id: "r-003",
    name: "Suresh Reddy",
    phoneNumber: "+91 76543 21098",
    rating: 4.5,
    location: {
      latitude: 12.9725,
      longitude: 77.5940,
    },
  },
];

// Mock ride requests
export const mockRideRequests: RideRequest[] = [
  {
    id: "req-001",
    riderId: "r-001",
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
    estimatedDistance: 5.8,
    estimatedPrice: 130,
    estimatedDuration: 22,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
  {
    id: "req-002",
    riderId: "r-002",
    pickupLocation: {
      latitude: 12.9721,
      longitude: 77.5948,
      address: "MG Road, Bengaluru",
    },
    dropLocation: {
      latitude: 12.9766,
      longitude: 77.5993,
      address: "Ulsoor Lake, Bengaluru",
    },
    estimatedDistance: 3.2,
    estimatedPrice: 80,
    estimatedDuration: 15,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
  {
    id: "req-003",
    riderId: "r-003",
    pickupLocation: {
      latitude: 12.9725,
      longitude: 77.5940,
      address: "Vidhana Soudha, Bengaluru",
    },
    dropLocation: {
      latitude: 12.9854,
      longitude: 77.7081,
      address: "Whitefield, Bengaluru",
    },
    estimatedDistance: 15.4,
    estimatedPrice: 320,
    estimatedDuration: 45,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
];

// Mock recent rides
export const mockRecentRides: Ride[] = [
  {
    id: "ride-001",
    riderId: "r-004",
    driverId: "d-001",
    pickupLocation: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: "Bengaluru City Railway Station",
    },
    dropLocation: {
      latitude: 12.9569,
      longitude: 77.7011,
      address: "Mahadevapura, Bengaluru",
    },
    distance: 12.7,
    price: 250,
    duration: 38,
    status: "COMPLETED",
    startedAt: "2023-09-15T10:30:00Z",
    completedAt: "2023-09-15T11:08:00Z",
    riderRating: 5,
    driverRating: 5,
  },
  {
    id: "ride-002",
    riderId: "r-005",
    driverId: "d-001",
    pickupLocation: {
      latitude: 12.9622,
      longitude: 77.5971,
      address: "Lalbagh Botanical Garden, Bengaluru",
    },
    dropLocation: {
      latitude: 12.9779,
      longitude: 77.5895,
      address: "Malleshwaram, Bengaluru",
    },
    distance: 6.3,
    price: 140,
    duration: 25,
    status: "COMPLETED",
    startedAt: "2023-09-15T13:15:00Z",
    completedAt: "2023-09-15T13:40:00Z",
    riderRating: 4,
    driverRating: 4,
  },
  {
    id: "ride-003",
    riderId: "r-006",
    driverId: "d-001",
    pickupLocation: {
      latitude: 12.9800,
      longitude: 77.5835,
      address: "Mantri Square Mall, Bengaluru",
    },
    dropLocation: {
      latitude: 12.9698,
      longitude: 77.7499,
      address: "Marathahalli, Bengaluru",
    },
    distance: 17.8,
    price: 350,
    duration: 55,
    status: "COMPLETED",
    startedAt: "2023-09-15T15:20:00Z",
    completedAt: "2023-09-15T16:15:00Z",
    riderRating: 5,
    driverRating: 5,
  },
];

// Earnings data for charts
export interface DailyEarning {
  date: string;
  amount: number;
  rides: number;
}

export const mockWeeklyEarnings: DailyEarning[] = [
  { date: "Mon", amount: 950, rides: 8 },
  { date: "Tue", amount: 1200, rides: 10 },
  { date: "Wed", amount: 850, rides: 7 },
  { date: "Thu", amount: 1100, rides: 9 },
  { date: "Fri", amount: 1500, rides: 12 },
  { date: "Sat", amount: 1800, rides: 14 },
  { date: "Sun", amount: 1300, rides: 11 },
];

// Vehicle types for registration
export const vehicleTypes = [
  { id: "AUTO", name: "Auto Rickshaw" },
  { id: "BIKE", name: "Bike" },
  { id: "CAR", name: "Car" },
];
