// Mathematical models for inhaled particulate exposure, Berkeley Earth cigarette equivalence, and CO2 emissions

/**
 * Calculate microgram reduction of inhaled PM2.5 based on human minute ventilation volume
 * VE = Tidal Volume * Respiratory Rate (typically 6 - 8 L/min resting, 25 - 45 L/min active cycling/running)
 * 1 cubic meter (m³) = 1000 Liters
 * Formula: Inhaled PM2.5 (µg) = (Air PM2.5 in µg/m³) * (VE in L/min / 1000) * (Minutes of Exposure)
 */
export function calculateInhaledPm25({
  ambientPm25,       // µg/m³
  mitigatedPm25,     // µg/m³ (e.g. indoors with HEPA or N95 mask)
  durationMinutes,   // minutes
  activityLevel = 'moderate' // 'rest', 'moderate', 'vigorous'
}) {
  const ventilationRates = {
    rest: 7.5,        // L/min (sitting, sleeping)
    moderate: 16.0,   // L/min (walking, light commute)
    vigorous: 38.0    // L/min (cycling, running, manual labor)
  };

  const ve = ventilationRates[activityLevel] || 16.0;
  const volumeM3 = (ve / 1000) * durationMinutes;

  const baselineInhaledUg = ambientPm25 * volumeM3;
  const mitigatedInhaledUg = mitigatedPm25 * volumeM3;
  const savedUg = Math.max(0, baselineInhaledUg - mitigatedInhaledUg);

  return {
    baselineInhaledUg: Math.round(baselineInhaledUg),
    mitigatedInhaledUg: Math.round(mitigatedInhaledUg),
    savedUg: Math.round(savedUg),
    exposurePercentReduction: ambientPm25 > 0 ? Math.round(((ambientPm25 - mitigatedPm25) / ambientPm25) * 100) : 0
  };
}

/**
 * Berkeley Earth Equivalent Cigarettes Formula:
 * 1 cigarette/day ≈ 22 µg/m³ of PM2.5 exposure for 24 hours.
 * Cigarettes Avoided = (Saved PM2.5 in µg/m³ * Hours / 24) / 22
 */
export function calculateCigarettesAvoided(savedPm25UgPerM3, hoursExposed = 12) {
  const cigCount = (savedPm25UgPerM3 * (hoursExposed / 24)) / 22;
  return Math.max(0, parseFloat(cigCount.toFixed(2)));
}

/**
 * Community and household carbon & particulate emissions avoided
 */
export function calculateHouseholdSavings({
  carpoolDays = 5,
  electricHeatingShiftHours = 4,
  metroTrips = 8
}) {
  // 1 carpool shift saves approx ~3.6 kg CO2 and 18g tailpipe PM per day
  const carpoolCo2Kg = carpoolDays * 3.6;
  const carpoolPm25Grams = carpoolDays * 18;

  // Shifting from wood stove / kerosene heater to heat pump / radiator saves ~4.2 kg CO2/day
  const heatingCo2Kg = electricHeatingShiftHours * 1.05;

  // Metro trip vs solo car saves ~1.8 kg CO2 per 15km trip
  const transitCo2Kg = metroTrips * 1.8;

  const totalCo2Kg = carpoolCo2Kg + heatingCo2Kg + transitCo2Kg;
  const treeEquivalents = (totalCo2Kg / 21.7).toFixed(1); // 1 mature tree absorbs ~21.7 kg CO2/year

  return {
    totalCo2Kg: parseFloat(totalCo2Kg.toFixed(1)),
    carpoolCo2Kg: parseFloat(carpoolCo2Kg.toFixed(1)),
    heatingCo2Kg: parseFloat(heatingCo2Kg.toFixed(1)),
    transitCo2Kg: parseFloat(transitCo2Kg.toFixed(1)),
    carpoolPm25Grams: Math.round(carpoolPm25Grams),
    treeEquivalents
  };
}
