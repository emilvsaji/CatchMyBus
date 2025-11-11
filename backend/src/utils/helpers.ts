// Calculate approximate distance between stops (in km)
export const calculateDistance = (fromIndex: number, toIndex: number): number => {
  // Mock calculation - in production, use actual coordinates
  const stopDistance = 15; // Average distance between stops in km
  return Math.abs(toIndex - fromIndex) * stopDistance;
};

// Calculate estimated travel time (in minutes)
export const calculateTime = (distance: number): number => {
  // Average bus speed: 40 km/h
  const avgSpeed = 40;
  return Math.round((distance / avgSpeed) * 60);
};

// Calculate fare based on distance and bus type
export const calculateFare = (distance: number, busType: string): number => {
  let baseRate = 1.5; // Base rate per km

  // Adjust based on bus type
  switch (busType) {
    case 'KSRTC':
      baseRate = 1.2;
      break;
    case 'Private':
      baseRate = 1.5;
      break;
    case 'Fast':
      baseRate = 1.8;
      break;
    case 'Super Fast':
      baseRate = 2.2;
      break;
    case 'Ordinary':
      baseRate = 1.0;
      break;
  }

  const fare = distance * baseRate;
  return Math.round(fare);
};

// Format date to readable string
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

// Validate Kerala bus number format
export const validateBusNumber = (busNumber: string): boolean => {
  const pattern = /^KL-\d{2}-[A-Z]{2}-\d{4}$/;
  return pattern.test(busNumber);
};
