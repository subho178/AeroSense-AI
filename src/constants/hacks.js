/**
 * Indoor Air Quality (IAQ) Room-by-Room Engineering Hacks & Corsi-Rosenthal Presets
 */

export const IAQ_ROOM_HACKS = [
  {
    room: 'Kitchen',
    riskLevel: 'Critical Hazard',
    icon: 'Flame',
    summary: 'Gas burners and high-heat frying generate PM2.5 levels exceeding 400 µg/m³ within 15 minutes.',
    actions: [
      {
        title: 'Exhaust Hood Pre-Ignition Rule',
        desc: 'Turn range hood to MAX 2 minutes BEFORE striking gas burner to establish negative draft flow.'
      },
      {
        title: 'Induction / Electric Cooking Migration',
        desc: 'Switch to a portable 1800W induction cooktop during winter smog months to eliminate toxic NO2 and unburned methane.'
      },
      {
        title: 'High Smoke-Point Oil Selection',
        desc: 'Replace butter/unrefined oils with avocado or refined rice bran oil (smoke point > 250°C) to prevent aerosolized acrolein.'
      }
    ]
  },
  {
    room: 'Bedroom',
    riskLevel: 'High Exposure (8hr Duration)',
    icon: 'BedDouble',
    summary: 'You spend 1/3 of your life breathing bedroom air. Poor air here directly impairs deep REM recovery.',
    actions: [
      {
        title: 'Window Weatherstripping & Silicone Draft Stopper',
        desc: 'Apply adhesive V-strip silicone weatherstripping around window frames. Cuts outdoor smog leakage by up to 65%.'
      },
      {
        title: 'The Sleep Purifier Placement Trick',
        desc: 'Place your air purifier directly facing the head of the bed (3-4 feet away) at low speed rather than across the room.'
      },
      {
        title: 'Microfiber Bedding Protocol',
        desc: 'Dust mites combine with micro-soot. Wash bedding in 60°C water weekly and avoid shaking blankets vigorously in the room.'
      }
    ]
  },
  {
    room: 'Living Room',
    riskLevel: 'Moderate Buffer Zone',
    icon: 'Sofa',
    summary: 'Primary transit hub where outdoor smog enters through exterior doorways and shoe traffic.',
    actions: [
      {
        title: 'Double-Door Air Lock / Threshold Rug',
        desc: 'Place a high-pile washable trap mat inside and outside the door. Remove outdoor jackets immediately upon entry.'
      },
      {
        title: 'Phytoremediation Plant Trio',
        desc: 'Keep Snake Plants (Sansevieria) and Areca Palms. They emit oxygen at night and bind indoor volatile organic compounds (VOCs).'
      },
      {
        title: 'HEPA Vacuuming with Sealed Filtration',
        desc: 'Never use cheap bagless vacuums without genuine HEPA exhausts — they pulverize coarse soot into ultra-fine breathable particles.'
      }
    ]
  }
];

export const CORSI_ROSENTHAL_PRESETS = [
  {
    id: 'standard_cube',
    name: 'Standard 4-Filter Cube',
    filters: 4,
    filterRating: 'MERV 13',
    fanSizeInches: 20,
    costUsd: 75,
    cadrCfm: 550,
    noiseDb: 51,
    filterLifespanMonths: 6,
    recommendedRoomSqFt: 600,
    materials: [
      '1x 20" Box Fan (Lasko or similar, 3-speed)',
      '4x 20"x20"x2" (or 1") MERV 13 Air Filters',
      '1x 20"x20" Cardboard Bottom Shroud',
      '1x Cardboard Fan Shroud (cuts backflow by 20% CFM)',
      '1x Roll Heavy-Duty Duct Tape or Gorilla Tape'
    ],
    commercialEquivalentCost: 350,
    cadrPerDollar: '7.3 CFM/$',
    advantages: 'Exceptional CADR, low filter resistance, runs whisper quiet on Speed 1.'
  },
  {
    id: 'compact_compucube',
    name: 'Mini / Desktop 2-Filter Wedge',
    filters: 2,
    filterRating: 'MERV 13',
    fanSizeInches: 12,
    costUsd: 45,
    cadrCfm: 240,
    noiseDb: 44,
    filterLifespanMonths: 5,
    recommendedRoomSqFt: 250,
    materials: [
      '1x 12" High-Velocity or PC-Array Fan',
      '2x 12"x12"x1" MERV 13 Filters',
      'Cardboard V-chassis & Painter Tape'
    ],
    commercialEquivalentCost: 160,
    cadrPerDollar: '5.3 CFM/$',
    advantages: 'Perfect for small children nursery, home office desk, or student dorms.'
  },
  {
    id: 'beast_tower',
    name: 'Heavy-Duty 5-Filter Octa-Cube',
    filters: 5,
    filterRating: 'MERV 14',
    fanSizeInches: 20,
    costUsd: 110,
    cadrCfm: 720,
    noiseDb: 54,
    filterLifespanMonths: 9,
    recommendedRoomSqFt: 950,
    materials: [
      '1x 20" Industrial Grade Box Fan',
      '4x 20"x25"x2" MERV 14 Filters (Sides)',
      '1x 20"x20"x2" MERV 14 Filter (Bottom intake on riser feet)',
      'High-velocity fan shroud gasket'
    ],
    commercialEquivalentCost: 650,
    cadrPerDollar: '6.5 CFM/$',
    advantages: 'Maximum community center / classroom air exchange rate (>6 ACH).'
  }
];
