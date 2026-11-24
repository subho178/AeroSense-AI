import { describe, it, expect } from 'vitest';
import { getAqiCategory, generateDiurnalCurve } from '../services/aqiService';

describe('Air Quality Index & Diurnal Inversion Telemetry', () => {
  it('correctly maps AQI values to standardized EPA & CPCB health alert categories', () => {
    expect(getAqiCategory(35).label).toBe('Good');
    expect(getAqiCategory(85).label).toBe('Moderate');
    expect(getAqiCategory(135).label).toBe('Unhealthy for Sensitive Groups');
    expect(getAqiCategory(180).label).toBe('Unhealthy');
    expect(getAqiCategory(260).label).toBe('Very Unhealthy');
    expect(getAqiCategory(420).label).toBe('Hazardous (Severe Smog)');
  });

  it('generates a 24-hour diurnal curve reflecting atmospheric thermal inversion physics', () => {
    const baseAqi = 300;
    const basePm25 = 240;
    const curve = generateDiurnalCurve(baseAqi, basePm25);

    expect(curve).toHaveLength(24);

    // Verify properties on each hourly data point
    curve.forEach(point => {
      expect(point).toHaveProperty('hour');
      expect(point).toHaveProperty('timeLabel');
      expect(point).toHaveProperty('aqi');
      expect(point).toHaveProperty('pm25');
      expect(point).toHaveProperty('isVentilationWindow');
      expect(point).toHaveProperty('inversionStrength');
    });

    // Verify Midday Breakthrough Ventilation Window is identified between 12:00 and 15:00
    const ventPoints = curve.filter(p => p.isVentilationWindow);
    expect(ventPoints.length).toBeGreaterThan(0);
    ventPoints.forEach(p => {
      expect(p.hour).toBeGreaterThanOrEqual(12);
      expect(p.hour).toBeLessThanOrEqual(15);
      expect(p.inversionStrength).toBe('Broken/Vent');
    });
  });
});
