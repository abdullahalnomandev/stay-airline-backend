// import fetch from "node-fetch";
import https from 'https';
type LatLng = {
  latitude: number;
  longitude: number;
};

export async function getLatLongWithLocalRequest(address: string): Promise<LatLng> {
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


// export const getLatLongWithLocalRequest = (address: string): Promise<LatLng> => {
//   return new Promise((resolve, reject) => {
//     const requestDetails = {
//       hostname: 'nominatim.openstreetmap.org',
//       method: 'GET',
//       path: `/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
//       headers: {
//         // Add User-Agent header to avoid 403 error
//         'User-Agent': 'Mozilla/5.0 (compatible; MyApp/1.0)',
//         'Accept': 'application/json'
//       }
//     }

//     const req = https.request(requestDetails, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });

//       res.on('end', () => {
//         const status = res.statusCode;

//         if (status === 200 || status === 201) {
//           try {
//             const parsedData = JSON.parse(data);
//             if (!parsedData || !Array.isArray(parsedData) || parsedData.length === 0) {
//               reject(new Error("Address not found"));
//               return;
//             }
//             resolve({
//               latitude: parseFloat(parsedData[0].lat),
//               longitude: parseFloat(parsedData[0].lon),
//             });
//           } catch (error) {
//             reject(new Error("Failed to parse response data"));
//           }
//         } else {
//           reject(new Error(`Status code returned was ${status}`));
//         }
//       });
//     });

//     req.on('error', (error) => reject(error));
//     req.end();
//   });
// }


// stripe listen --forward-to http://10.10.7.72:5000/api/webhook