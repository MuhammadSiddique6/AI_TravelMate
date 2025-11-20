const axios = require('axios');

// Open-Meteo free API (no key needed)
const BASE = 'https://api.open-meteo.com/v1/forecast';

const WMO_CODE_TO_DESC = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'depositing rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  56: 'freezing drizzle',
  57: 'dense freezing drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  66: 'freezing rain',
  67: 'heavy freezing rain',
  71: 'slight snow',
  73: 'moderate snow',
  75: 'heavy snow',
  77: 'snow grains',
  80: 'rain showers',
  81: 'heavy rain showers',
  82: 'violent rain showers',
  85: 'snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with hail',
  99: 'heavy thunderstorm with hail',
};

async function currentWeather(lat, lng) {
  const { data } = await axios.get(BASE, {
    params: {
      latitude: lat,
      longitude: lng,
      current_weather: true,
      hourly: 'temperature_2m',
      timezone: 'auto',
    },
    timeout: 10000,
  });
  const current = data?.current_weather || {};
  const temp = typeof current.temperature === 'number' ? current.temperature : current.temperature_2m;
  const code = current.weathercode;
  const desc = WMO_CODE_TO_DESC[code] || 'weather';
  // Return in an OpenWeather-like shape used by routes/aiRoutes.js
  return {
    weather: [{ description: desc }],
    main: { temp },
  };
}

async function reverseGeocodeCity(lat, lng) {
  // Use OpenStreetMap Nominatim reverse geocoding to get city/locality name
  const url = 'https://nominatim.openstreetmap.org/reverse';
  const { data } = await axios.get(url, {
    params: { format: 'jsonv2', lat, lon: lng, zoom: 10, addressdetails: 1 },
    headers: { 'User-Agent': 'travel-app/1.0 (contact: example@example.com)' },
    timeout: 10000,
  });
  const addr = data?.address || {};
  // Prefer city, fall back to town/village/state
  return addr.city || addr.town || addr.village || addr.state || addr.county || 'Unknown';
}

async function currentCityWeather(lat, lng) {
  const weather = await currentWeather(lat, lng);
  const city = await reverseGeocodeCity(lat, lng);
  return {
    city,
    description: weather.weather?.[0]?.description || 'weather',
    temp_c: weather.main?.temp,
  };
}

module.exports = { currentWeather, currentCityWeather };

 

