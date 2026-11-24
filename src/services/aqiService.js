// Open-Meteo & simulated real-time winter smog telemetry service

export function getAqiCategory(aqi) {
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', badge: 'bg-emerald-500' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', badge: 'bg-amber-500' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', badge: 'bg-orange-500' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-rose-500', bg: 'bg-rose-500/15', border: 'border-rose-500/30', badge: 'bg-rose-500' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30', badge: 'bg-purple-500' };
  return { label: 'Hazardous (Severe Smog)', color: 'text-rose-400', bg: 'bg-red-950/60', border: 'border-rose-600/50', badge: 'bg-rose-700' };
}

// Generate a 24-hour diurnal winter smog curve reflecting thermal inversion physics:
// Peaks in morning (7-10 AM) and late evening (8-11 PM) due to calm radiation cooling and cold pools
// Dips in early afternoon (1-3 PM) when solar warming temporarily breaks the shallow inversion boundary
export function generateDiurnalCurve(baseAqi, basePm25) {
  const hours = [];
  const currentHour = new Date().getHours();

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    let factor = 1.0;

    // Morning peak (rush + nighttime inversion trap)
    if (hour >= 6 && hour <= 10) {
      factor = 1.25 + 0.1 * Math.sin(((hour - 6) / 4) * Math.PI);
    }
    // Midday solar warming / breakthrough window (optimal ventilation)
    else if (hour >= 12 && hour <= 15) {
      factor = 0.65 + 0.05 * Math.sin(((hour - 12) / 3) * Math.PI);
    }
    // Evening cold pool rebuilding + traffic & heating
    else if (hour >= 19 && hour <= 23) {
      factor = 1.28 + 0.12 * Math.sin(((hour - 19) / 4) * Math.PI);
    }
    // Late night calm cooling
    else if (hour >= 0 && hour <= 5) {
      factor = 1.05 + 0.05 * (hour / 5);
    } else {
      factor = 0.85;
    }

    const aqi = Math.round(baseAqi * factor);
    const pm25 = Math.round(basePm25 * factor);
    const isVentilationWindow = hour >= 12 && hour <= 15;

    hours.push({
      hour,
      timeLabel: `${hour.toString().padStart(2, '0')}:00`,
      aqi,
      pm25,
      isVentilationWindow,
      inversionStrength: hour >= 6 && hour <= 10 || hour >= 19 ? 'Strong Trap' : (isVentilationWindow ? 'Broken/Vent' : 'Moderate')
    });
  }

  return hours;
}

// Module-level in-memory cache to eliminate redundant network requests and maximize efficiency
const telemetryCache = new Map();

// Fetch live telemetry from Open-Meteo Air Quality API with graceful fallback to hyper-realistic calibrated data
export async function fetchLiveCityAirQuality(city) {
  if (!city || !city.id) return city;

  // Instant response if city telemetry was previously resolved
  if (telemetryCache.has(city.id)) {
    return telemetryCache.get(city.id);
  }

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide&hourly=us_aqi,pm2_5&timezone=auto&forecast_days=2`;
    
    // Quick 3-second abort timeout to ensure snappy UI interaction
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const aqi = Math.round(current.us_aqi || city.baseAqi);
      const pm25 = Math.round(current.pm2_5 || city.basePm25);
      const pm10 = Math.round(current.pm10 || city.basePm10);
      const no2 = Math.round(current.nitrogen_dioxide || city.baseNo2);

      const result = {
        ...city,
        isLive: true,
        baseAqi: aqi,
        basePm25: pm25,
        basePm10: pm10,
        baseNo2: no2,
        hourly: generateDiurnalCurve(aqi, pm25)
      };

      telemetryCache.set(city.id, result);
      return result;
    }
  } catch (err) {
    console.warn(`Live telemetry unavailable for ${city.name}, using calibrated thermal-inversion model`, err);
  }

  const fallbackResult = {
    ...city,
    isLive: false,
    hourly: generateDiurnalCurve(city.baseAqi, city.basePm25)
  };

  telemetryCache.set(city.id, fallbackResult);
  return fallbackResult;
}
