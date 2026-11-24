import { describe, it, expect } from 'vitest';
import { 
  calculateRoomVolume, 
  calculateAch, 
  evaluateAchThreshold, 
  estimateIndoorSteadyStatePm25 
} from '../utils/iaqMath';

describe('IAQ & Aerosol Filtration Engineering Utilities', () => {
  it('calculates room volume correctly with default and custom ceiling heights', () => {
    // 400 sq ft room with standard 9 ft ceiling
    expect(calculateRoomVolume(400, 9)).toBe(3600);
    // 500 sq ft room with default ceiling
    expect(calculateRoomVolume(500)).toBe(4500);
    // Edge case: invalid bounds
    expect(calculateRoomVolume(-10, 9)).toBe(0);
    expect(calculateRoomVolume(100, 0)).toBe(0);
  });

  it('calculates Air Changes per Hour (ACH) according to ASHRAE formula', () => {
    // 550 CFM CADR (Corsi-Rosenthal Box) in 450 sq ft room with 9 ft ceiling (4050 cu ft)
    // ACH = (550 * 60) / 4050 = 33000 / 4050 = 8.148 -> 8.1
    const ach = calculateAch(550, 450, 9);
    expect(ach).toBe(8.1);

    // Commercial mini purifier (120 CFM) in 600 sq ft room with 10 ft ceiling (6000 cu ft)
    // ACH = (120 * 60) / 6000 = 7200 / 6000 = 1.2
    const lowAch = calculateAch(120, 600, 10);
    expect(lowAch).toBe(1.2);
  });

  it('evaluates CDC/ASHRAE clean air protection thresholds', () => {
    const optimal = evaluateAchThreshold(6.5);
    expect(optimal.isOptimal).toBe(true);
    expect(optimal.tier).toBe('Optimal');

    const moderate = evaluateAchThreshold(3.0);
    expect(moderate.isOptimal).toBe(false);
    expect(moderate.tier).toBe('Moderate');

    const suboptimal = evaluateAchThreshold(1.4);
    expect(suboptimal.isOptimal).toBe(false);
    expect(suboptimal.tier).toBe('Suboptimal');
  });

  it('models indoor PM2.5 steady-state reduction under active filtration', () => {
    const ambientPm25 = 350; // Severe Delhi winter smog
    // With 5.0 ACH filtration
    const indoorClean = estimateIndoorSteadyStatePm25(ambientPm25, 5.0);
    expect(indoorClean).toBeLessThan(80); // Massive reduction from 350

    // Zero ambient PM2.5
    expect(estimateIndoorSteadyStatePm25(0, 5.0)).toBe(0);
  });
});
