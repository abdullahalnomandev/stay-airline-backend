import fetch from "node-fetch";

type LatLng = {
  latitude: number;
  longitude: number;
};

export async function getLatLngFromAddress(address: string): Promise<LatLng> {
  if (!address) throw new Error("Address is required");
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&limit=1`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data || !Array.isArray(data) || data.length === 0) throw new Error("Address not found");

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
}


// Helper function to convert degrees to radians
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const getDurationOfTwoPoints = (
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
  averageSpeedKmh = 20
): number => {
  const earthRadiusKm = 6371;

  // Convert latitude and longitude differences to radians
  const dLat = toRadians(endLatitude - startLatitude);
  const dLon = toRadians(endLongitude - startLongitude);

  // Convert start and end latitudes to radians
  const lat1 = toRadians(startLatitude);
  const lat2 = toRadians(endLatitude);

  // Haversine formula to calculate the distance
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  // Calculate duration in minutes
  const durationInHours = distance / averageSpeedKmh;
  const durationInMinutes = durationInHours * 60;

  return durationInMinutes;
};




// stripe listen --forward-to http://localhost:5000/api/webhook