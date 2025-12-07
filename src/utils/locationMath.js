/**
 * Utility: Find nearest location from a list given user coordinates
 * Uses Haversine formula for distance calculation
 */
import { LOCATIONS } from '../data/locations';

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestLocation(userLocation, locations = LOCATIONS) {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) return null;
  let nearest = null;
  let minDist = Infinity;
  for (const loc of locations) {
    const coords = loc.google?.coordinates;
    if (!coords) continue;
    const dist = haversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      coords.lat,
      coords.lng
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = loc;
    }
  }
  return nearest;
}
