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



// stripe listen --forward-to http://localhost:5000/api/webhook