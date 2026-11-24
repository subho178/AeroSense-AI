import { useState, useEffect, useCallback } from 'react';
import { fetchLiveCityAirQuality } from '../services/aqiService';

// Module-level in-memory cache to eliminate redundant network hits and CPU object thrashing
const telemetryCache = new Map();

/**
 * Custom React hook for hyper-local air quality telemetry with in-memory caching.
 * Automatically fetches live or calibrated data when city changes,
 * provides loading states, and supports manual telemetry refresh.
 * 
 * @param {Object} selectedCity 
 * @returns {{ cityData: Object, isLoading: boolean, refresh: Function }}
 */
export function useAirQuality(selectedCity) {
  const [cityData, setCityData] = useState(() => {
    return telemetryCache.get(selectedCity.id) || selectedCity;
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadTelemetry = useCallback(async (city, force = false) => {
    if (!city) return;

    if (!force && telemetryCache.has(city.id)) {
      setCityData(telemetryCache.get(city.id));
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchLiveCityAirQuality(city);
      telemetryCache.set(city.id, data);
      setCityData(data);
    } catch (err) {
      console.warn('Failed to load telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadTelemetry(selectedCity).then(() => {
      if (!isMounted) return;
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCity, loadTelemetry]);

  const refresh = useCallback(() => {
    return loadTelemetry(selectedCity, true);
  }, [selectedCity, loadTelemetry]);

  return {
    cityData,
    isLoading,
    refresh
  };
}
