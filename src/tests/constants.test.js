import { describe, it, expect } from 'vitest';
import { 
  DEFAULT_CITIES, 
  VULNERABILITY_PROFILES, 
  CORSI_ROSENTHAL_PRESETS,
  CLEAN_COMMUTE_ALTERNATIVES 
} from '../constants';

describe('Domain Models & Regional Smog Datasets', () => {
  it('contains comprehensive Indian and international smog hubs with valid geographic and inversion metadata', () => {
    expect(DEFAULT_CITIES.length).toBeGreaterThanOrEqual(25);

    DEFAULT_CITIES.forEach((city) => {
      expect(city).toHaveProperty('id');
      expect(city).toHaveProperty('name');
      expect(city).toHaveProperty('country');
      expect(typeof city.lat).toBe('number');
      expect(typeof city.lon).toBe('number');
      expect(city.baseAqi).toBeGreaterThan(0);
      expect(city.basePm25).toBeGreaterThan(0);
      expect(city.inversionRisk).toBeDefined();
      expect(city.ventilationWindow).toBeDefined();
      expect(Array.isArray(city.primarySources)).toBe(true);
      expect(city.primarySources.length).toBeGreaterThan(0);
    });
  });

  it('validates clinical vulnerability risk multipliers and actionable tips', () => {
    expect(VULNERABILITY_PROFILES.length).toBeGreaterThanOrEqual(4);

    VULNERABILITY_PROFILES.forEach((profile) => {
      expect(profile.riskMultiplier).toBeGreaterThan(1.0);
      expect(profile.priorityTips.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('verifies Corsi-Rosenthal filter configurations and economic advantages', () => {
    CORSI_ROSENTHAL_PRESETS.forEach((preset) => {
      expect(preset.cadrCfm).toBeGreaterThan(200);
      expect(preset.costUsd).toBeLessThan(150);
      expect(preset.commercialEquivalentCost).toBeGreaterThan(preset.costUsd);
      expect(preset.materials.length).toBeGreaterThan(0);
    });
  });

  it('verifies clean commute alternatives and positive carbon offsets', () => {
    CLEAN_COMMUTE_ALTERNATIVES.forEach((alt) => {
      expect(alt.emissionSavedKgCo2PerDay).toBeGreaterThan(0);
      expect(alt.exposureReduction).toBeDefined();
    });
  });
});
