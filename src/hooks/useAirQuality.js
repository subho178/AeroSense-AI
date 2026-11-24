import { useState, useEffect, useCallback } from 'react';
import { fetchLiveCityAirQuality } from '../services/aqiService';

/**
 * Custom React hook for hyper-local air quality telemetry.
 * Automatically fetches live or calibrated data when city changes,
 * provides loading states, and supports manual telemetry refresh.
 * 
 * @param {Object} selectedCity 
 * @returns {{ cityData: Object, isLoading: boolean, refresh: Function }}
 */
export function useAirQuality(selectedCity) {
  const [cityData, setCityData] = useState(selectedCity);
  const [isLoading, setIsLoading] = useState(false);

  const loadTelemetry = useCallback(async (city) => {
    if (!city) return;
    setIsLoading(true);
    try {
      const data = await fetchLiveCityAirQuality(city);
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
    return loadTelemetry(selectedCity);
  }, [selectedCity, loadTelemetry]);

  return {
    cityData,
    isLoading,
    refresh
  };
}
