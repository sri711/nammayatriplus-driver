
/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(2));
};

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculate estimated time of arrival
 * @param distance Distance in kilometers
 * @param averageSpeed Average speed in km/h (default: 20)
 * @returns Duration in minutes
 */
export const calculateETA = (
  distance: number,
  averageSpeed: number = 20
): number => {
  // Time = Distance / Speed (in hours)
  // Convert to minutes
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = timeInHours * 60;
  return Math.round(timeInMinutes);
};

/**
 * Calculate price based on distance
 * @param distance Distance in kilometers
 * @param vehicleType Type of vehicle
 * @returns Price in rupees
 */
export const calculatePrice = (
  distance: number,
  vehicleType: 'AUTO' | 'BIKE' | 'CAR' = 'AUTO'
): number => {
  let basePrice = 0;
  let pricePerKm = 0;

  // Set base price and per km rate based on vehicle type
  switch (vehicleType) {
    case 'BIKE':
      basePrice = 20;
      pricePerKm = 12;
      break;
    case 'AUTO':
      basePrice = 30;
      pricePerKm = 15;
      break;
    case 'CAR':
      basePrice = 50;
      pricePerKm = 22;
      break;
    default:
      basePrice = 30;
      pricePerKm = 15;
  }

  // Calculate price: base price + (distance * price per km)
  let totalPrice = basePrice + distance * pricePerKm;

  // Apply minimum price
  const minimumPrice = vehicleType === 'BIKE' ? 30 : vehicleType === 'AUTO' ? 50 : 100;
  totalPrice = Math.max(totalPrice, minimumPrice);

  // Round to nearest 5
  return Math.round(totalPrice / 5) * 5;
};

/**
 * Format price to Indian Rupees
 * @param price Price in rupees
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format distance
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  return `${distance} km`;
};

/**
 * Format duration
 * @param duration Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (duration: number): string => {
  if (duration < 60) {
    return `${duration} min`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (minutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${minutes} min`;
};
