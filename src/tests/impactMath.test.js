import { describe, it, expect } from 'vitest';
import { 
  calculateInhaledPm25, 
  calculateCigarettesAvoided, 
  calculateHouseholdSavings 
} from '../services/impactMath';

describe('Impact Mathematics & Biometric Exposure Calculations', () => {
  it('correctly computes inhaled PM2.5 reduction based on respiratory rate', () => {
    // 150 µg/m³ ambient vs 25 µg/m³ mitigated, 120 minutes moderate activity (VE = 16 L/min)
    const result = calculateInhaledPm25({
      ambientPm25: 150,
      mitigatedPm25: 25,
      durationMinutes: 120,
      activityLevel: 'moderate'
    });

    // Volume = (16 / 1000) * 120 = 1.92 m³
    // Baseline = 150 * 1.92 = 288 µg
    // Mitigated = 25 * 1.92 = 48 µg
    // Saved = 240 µg
    expect(result.baselineInhaledUg).toBe(288);
    expect(result.mitigatedInhaledUg).toBe(48);
    expect(result.savedUg).toBe(240);
    expect(result.exposurePercentReduction).toBe(83);
  });

  it('correctly adapts minute ventilation rate for vigorous exercise', () => {
    // Vigorous VE = 38 L/min
    const result = calculateInhaledPm25({
      ambientPm25: 200,
      mitigatedPm25: 20,
      durationMinutes: 60,
      activityLevel: 'vigorous'
    });

    // Volume = (38 / 1000) * 60 = 2.28 m³
    // Baseline = 200 * 2.28 = 456 µg
    expect(result.baselineInhaledUg).toBe(456);
    expect(result.savedUg).toBe(410);
  });

  it('calculates Berkeley Earth equivalent cigarettes avoided with precision', () => {
    // Formula: (Saved PM2.5 µg/m³ * (Hours / 24)) / 22
    // If saved PM2.5 is 220 µg/m³ for 24 hours -> 220 / 22 = 10 cigarettes avoided
    const cigsFullDay = calculateCigarettesAvoided(220, 24);
    expect(cigsFullDay).toBe(10);

    // If saved 110 µg/m³ for 12 hours -> (110 * 0.5) / 22 = 2.5 cigarettes
    const cigsHalfDay = calculateCigarettesAvoided(110, 12);
    expect(cigsHalfDay).toBe(2.5);
  });

  it('calculates household carbon savings and tree equivalents', () => {
    const savings = calculateHouseholdSavings({
      carpoolDays: 5,
      electricHeatingShiftHours: 4,
      metroTrips: 10
    });

    // Carpool: 5 * 3.6 = 18.0 kg CO2
    // Heating: 4 * 1.05 = 4.2 kg CO2
    // Transit: 10 * 1.8 = 18.0 kg CO2
    // Total = 40.2 kg CO2
    expect(savings.totalCo2Kg).toBe(40.2);
    expect(savings.carpoolPm25Grams).toBe(90);
    expect(Number(savings.treeEquivalents)).toBeGreaterThan(1.5);
  });
});
