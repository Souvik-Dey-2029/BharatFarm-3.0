import { Router, Request, Response, NextFunction } from 'express';
import { fetchWeatherData } from '../services/climateRisk/weatherProvider.js';

const router = Router();

// Adapter mapping backend weather provider data to WeatherForecast schema
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const location = (req.query.location as string) || 'Haldia, West Bengal';
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;

    const weather = await fetchWeatherData(location, lat, lon);

    // Build farmer-friendly do/don't lists and advisory
    const doList: string[] = [];
    const dontList: string[] = [];

    if (weather.rainfallProbability > 60 || weather.expectedRainfallMm > 15) {
      doList.push('Ensure field drainage channels are clear and unobstructed.');
      doList.push('Store harvested produce in covered, elevated storage.');
      dontList.push('Avoid pesticide spraying or synthetic fertilizer application before rain.');
    } else {
      doList.push('Ideal window for field operations, irrigation, and foliar spray.');
      dontList.push('Do not over-irrigate if soil moisture is already adequate.');
    }

    const daily = (weather.daily || []).map((d) => ({
      date: d.date,
      dayLabel: d.dayName,
      condition: d.condition,
      icon: d.condition.toLowerCase().includes('rain') ? '🌦️' : '🌤️',
      tempMaxCelsius: Math.round(d.maxTemp),
      tempMinCelsius: Math.round(d.minTemp),
      precipitationSum: d.precipitation,
      windSpeedMaxKmh: Math.round(d.windSpeed)
    }));

    const responseData = {
      location: weather.location,
      temperatureCelsius: Math.round(weather.temperatureCelsius),
      condition: weather.condition,
      humidityPercent: weather.humidityPercent,
      windSpeedKmh: Math.round(weather.windSpeedKmh),
      rainfallProbability: weather.rainfallProbability,
      advisory: `Current weather in ${weather.location}: ${weather.condition} with ${Math.round(weather.temperatureCelsius)}°C. Rain chance: ${weather.rainfallProbability}%.`,
      doList,
      dontList,
      daily,
      source: weather.source === 'LIVE_OPEN_METEO' ? 'LIVE' : 'MOCK',
      updatedAt: weather.updatedAt || new Date().toISOString()
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
});

// Geocoding endpoint
router.get('/geocode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = (req.query.city as string || req.query.q as string || '').trim();
    if (!city || city.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=6&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.json({ success: true, data: [] });
    }

    const result = await response.json();
    const locations = (result.results || []).map((item: any) => ({
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || 'India',
      latitude: Number(item.latitude.toFixed(4)),
      longitude: Number(item.longitude.toFixed(4))
    }));

    res.json({ success: true, data: locations });
  } catch (error) {
    next(error);
  }
});

export default router;
