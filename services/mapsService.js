const axios = require('axios');

// OpenStreetMap Overpass API (free)
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function metersToDegrees(m) {
  // Roughly convert meters to degrees for ~latitude 30-35 (Pakistan)
  return m / 111320;
}

function osmFilterForType(type) {
  switch (type) {
    case 'restaurant':
      return '["amenity"="restaurant"]';
    case 'tourist_attraction':
      return '["tourism"="attraction"]';
    case 'transit_station':
      return '["public_transport"="stop_position"]';
    default:
      return '["amenity"="restaurant"]';
  }
}

async function queryOverpass(lat, lng, radiusM, type) {
  const deg = metersToDegrees(radiusM || 1000);
  const s = lat - deg;
  const n = lat + deg;
  const w = lng - deg;
  const e = lng + deg;
  const filter = osmFilterForType(type);
  const q = `[
    out:json
  ];
  node${filter}(${s},${w},${n},${e});
  out center;`;
  const { data } = await axios.post(OVERPASS_URL, q, { headers: { 'Content-Type': 'text/plain' }, timeout: 15000 });
  return data?.elements || [];
}

async function nearbyPlaces(lat, lng, radiusM, types) {
  const results = [];
  for (const t of types || []) {
    const els = await queryOverpass(lat, lng, radiusM, t);
    for (const el of els) {
      if (typeof el.lat !== 'number' || typeof el.lon !== 'number') continue;
      results.push({
        name: el.tags?.name || 'Unknown',
        types: [t],
        geometry: { location: { lat: el.lat, lng: el.lon } },
        rating: undefined,
        vicinity: el.tags?.addr_full || el.tags?.addr_street,
        formatted_address: undefined,
      });
    }
  }
  return results;
}

module.exports = { nearbyPlaces };

 

