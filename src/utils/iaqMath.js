/**
 * IAQ & Aerosol Filtration Engineering Utilities
 * Implements ASHRAE 62.2, CDC aerosol clearance, and UC Davis Corsi-Rosenthal Box physics.
 */

/**
 * Calculates cubic room volume given floor area and ceiling height.
 * @param {number} sqFt Floor area in square feet
 * @param {number} [ceilingHeightFt=9] Ceiling height in feet (defaults to 9ft standard)
 * @returns {number} Room volume in cubic feet
 */
export function calculateRoomVolume(sqFt, ceilingHeightFt = 9) {
  if (sqFt <= 0 || ceilingHeightFt <= 0) return 0;
  return sqFt * ceilingHeightFt;
}

/**
 * Computes Air Changes per Hour (ACH) based on Clean Air Delivery Rate (CADR).
 * Formula: ACH = (CADR [CFM] * 60) / Room Volume [cu.ft]
 * 
 * @param {number} cadrCfm Clean Air Delivery Rate in Cubic Feet per Minute
 * @param {number} sqFt Floor area in square feet
 * @param {number} [ceilingHeightFt=9] Ceiling height in feet
 * @returns {number} Calculated ACH rounded to 1 decimal place
 */
export function calculateAch(cadrCfm, sqFt, ceilingHeightFt = 9) {
  const volume = calculateRoomVolume(sqFt, ceilingHeightFt);
  if (volume === 0 || cadrCfm <= 0) return 0;
  return parseFloat(((cadrCfm * 60) / volume).toFixed(1));
}

/**
 * Assesses whether calculated ACH meets health standards for winter smog/epidemic protection.
 * - Optimal: >= 4.0 ACH (CDC/ASHRAE guideline for clean air clearance)
 * - Moderate: 2.0 to 3.9 ACH
 * - Suboptimal: < 2.0 ACH
 * 
 * @param {number} ach Air Changes per Hour
 * @returns {{ isOptimal: boolean, tier: 'Optimal' | 'Moderate' | 'Suboptimal', message: string }}
 */
export function evaluateAchThreshold(ach) {
  if (ach >= 4.0) {
    return {
      isOptimal: true,
      tier: 'Optimal',
      message: 'Meets or exceeds CDC/ASHRAE target (>4 ACH) for rapid aerosol clearance.'
    };
  }
  if (ach >= 2.0) {
    return {
      isOptimal: false,
      tier: 'Moderate',
      message: 'Adequate for mild conditions, but recommend boosting fan speed during peak smog.'
    };
  }
  return {
    isOptimal: false,
    tier: 'Suboptimal',
    message: 'Insufficient air turnover. Consider adding a secondary unit or reducing room perimeter.'
  };
}

/**
 * Estimates steady-state indoor PM2.5 concentration using a single-zone mass balance model.
 * Infiltration + Internal Source - Filtration Clearance = Steady State
 * 
 * @param {number} outdoorPm25 Ambient outdoor PM2.5 in µg/m³
 * @param {number} ach Air changes per hour from filtration
 * @param {number} [infiltrationRatio=0.65] Infiltration ratio without filtration
 * @returns {number} Estimated mitigated indoor PM2.5 in µg/m³
 */
export function estimateIndoorSteadyStatePm25(outdoorPm25, ach, infiltrationRatio = 0.65) {
  if (outdoorPm25 <= 0) return 0;
  const filtrationDecayFactor = 1 / (1 + (ach / 2.5));
  const estimated = outdoorPm25 * infiltrationRatio * filtrationDecayFactor;
  return Math.max(5, Math.round(estimated));
}
