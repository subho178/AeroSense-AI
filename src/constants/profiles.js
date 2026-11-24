/**
 * Family Vulnerability Profiles & Clinical Sensitivity Factors
 */

export const VULNERABILITY_PROFILES = [
  {
    id: 'pediatric',
    label: 'Infant / Toddler at Home',
    icon: 'Baby',
    description: 'Higher respiratory rate (2x adults), developing pulmonary alveoli, floor-level soot deposition.',
    riskMultiplier: 2.2,
    priorityTips: [
      'Keep crib/playpens elevated at least 2.5 feet off the floor where coarse heavy PM settles.',
      'Run HEPA/Corsi-Rosenthal box 30 mins before child sleep cycles.',
      'Wet-mop floors daily instead of dry sweeping which kicks up resuspended PM2.5.'
    ]
  },
  {
    id: 'asthma',
    label: 'Asthma / COPD / Respiratory',
    icon: 'Activity',
    description: 'Bronchial hyper-reactivity triggered by PM2.5 and nitrogen dioxide (NO2).',
    riskMultiplier: 2.8,
    priorityTips: [
      'Pre-medicate/carry rescue inhaler in insulated warm pocket (cold air exacerbates spasm).',
      'Wear genuine certified N95 / FFP2 mask with silicone seal if outdoor transit is mandatory.',
      'Strictly avoid wood fires, incense, or high-heat oil frying inside.'
    ]
  },
  {
    id: 'elderly',
    label: 'Senior / Cardiovascular',
    icon: 'HeartPulse',
    description: 'Winter smog triggers arterial vasoconstriction and systemic inflammatory thrombosis.',
    riskMultiplier: 2.4,
    priorityTips: [
      'Shift all morning walks to after 1:00 PM when thermal inversion clears and air warms.',
      'Maintain indoor humidity between 40-50% to prevent mucosal barrier cracking.',
      'Monitor blood pressure during severe smog spikes (AQI > 250).'
    ]
  },
  {
    id: 'outdoor_worker',
    label: 'Daily Commuter / Outdoor Active',
    icon: 'Bike',
    description: 'High physical exertion increases minute ventilation volume from 6 L/min to 40+ L/min.',
    riskMultiplier: 1.9,
    priorityTips: [
      'Switch from open two-wheeler/cycling to metro or sealed carpooling during morning peaks.',
      'Replace disposable N95 masks every 30-40 hours of heavy smog use.',
      'Saline nasal irrigation immediately after returning indoors washes trapped coarse PM.'
    ]
  },
  {
    id: 'pet_owner',
    label: 'Pet Owners',
    icon: 'PawPrint',
    description: 'Pets walk directly in low-hanging ground inversion smog and groom toxic fur soot.',
    riskMultiplier: 1.4,
    priorityTips: [
      'Wipe down paws and coats with damp microfibre cloth after outdoor potty breaks.',
      'Curtail vigorous outdoor fetch or running when AQI exceeds 150.',
      'Keep pet beds away from drafty exterior doors or unsealed balcony thresholds.'
    ]
  }
];
