/**
 * Utility: Haversine distance calculation, nearest location finder,
 * and location sorting/formatting helpers.
 * Single source of truth for all distance-based location logic.
 *
 * All functions are pure — they operate on passed data only,
 * never importing static data directly.
 */

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestLocation(userLocation, locations) {
  if (!locations?.length) return null;
  if (
    !userLocation ||
    userLocation.latitude === null ||
    userLocation.latitude === undefined ||
    userLocation.longitude === null ||
    userLocation.longitude === undefined
  )
    return null;
  let nearest = null;
  let minDist = Infinity;
  for (const loc of locations) {
    const coords = loc.google?.coordinates;
    if (!coords) continue;
    const dist = haversineDistance(userLocation.latitude, userLocation.longitude, coords.lat, coords.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = loc;
    }
  }
  return nearest;
}

/**
 * Sort locations by distance from user coordinates.
 * HQ is prioritized when distances are very close (within 100m).
 * @param {Array} locations - Array of location objects (required)
 * @param {Object} userCoords - { latitude, longitude } or null
 * @returns {Array} Locations with distance property, sorted nearest first
 */
export function getPreferredLocations({ userCoords, locations }) {
  if (!Array.isArray(locations) || locations.length === 0) return [];

  if (
    userCoords?.latitude === null ||
    userCoords?.latitude === undefined ||
    userCoords?.longitude === null ||
    userCoords?.longitude === undefined
  ) {
    return [...locations].sort((a, b) => {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      return 0;
    });
  }

  const locationsWithDistance = locations.map((location) => {
    const coords = location.google?.coordinates;
    if (!coords) {
      return { ...location, distance: Infinity };
    }
    const distance = haversineDistance(userCoords.latitude, userCoords.longitude, coords.lat, coords.lng);
    return { ...location, distance };
  });

  return locationsWithDistance.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) < 0.1) {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
    }
    return a.distance - b.distance;
  });
}

/**
 * Get the single preferred (closest) location for the user.
 * @param {Object} params
 * @param {Object} params.userCoords - { latitude, longitude } or null
 * @param {Array} params.locations - Array of location objects (required)
 * @returns {Object|null} Preferred location or null
 */
export function getPreferredLocation({ userCoords, locations }) {
  const preferred = getPreferredLocations({ userCoords, locations });
  return preferred.length > 0 ? preferred[0] : null;
}

/**
 * Format distance in km for display.
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string (e.g. "500m away", "2.3km away")
 */
export function formatDistance(distance) {
  if (distance === Infinity || distance === null || distance === undefined) {
    return '';
  }
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  return `${distance.toFixed(1)}km away`;
}
