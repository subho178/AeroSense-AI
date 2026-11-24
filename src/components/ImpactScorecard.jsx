import { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Cigarette, 
  ShieldCheck, 
  Leaf, 
  Trees, 
  Sliders, 
  TrendingDown,
  Info
} from 'lucide-react';
import { calculateInhaledPm25, calculateCigarettesAvoided, calculateHouseholdSavings } from '../services/impactMath';

export default function ImpactScorecard({ pm25 = 150 }) {
  const [carpoolDays, setCarpoolDays] = useState(4);
  const [electricHeatingHours, setElectricHeatingHours] = useState(5);
  const [metroTrips, setMetroTrips] = useState(6);
  const [indoorPurifierHours, setIndoorPurifierHours] = useState(10);

  // Memoized math computations for maximum UI responsiveness
  const mitigatedIndoorPm25 = useMemo(() => Math.round(pm25 * 0.15), [pm25]);

  const inhaledExposure = useMemo(() => {
    return calculateInhaledPm25({
      ambientPm25: pm25,
      mitigatedPm25: mitigatedIndoorPm25,
      durationMinutes: indoorPurifierHours * 60,
      activityLevel: 'moderate'
    });
  }, [pm25, mitigatedIndoorPm25, indoorPurifierHours]);

  const dailySavedPm25Ug = useMemo(() => Math.max(0, pm25 - mitigatedIndoorPm25), [pm25, mitigatedIndoorPm25]);

  const dailyCigarettesAvoided = useMemo(() => {
    return calculateCigarettesAvoided(dailySavedPm25Ug, indoorPurifierHours);
  }, [dailySavedPm25Ug, indoorPurifierHours]);

  const monthlyCigarettesAvoided = useMemo(() => {
    return (dailyCigarettesAvoided * 30).toFixed(1);
  }, [dailyCigarettesAvoided]);

  const householdSavings = useMemo(() => {
    return calculateHouseholdSavings({
      carpoolDays,
      electricHeatingShiftHours: electricHeatingHours,
      metroTrips
    });
  }, [carpoolDays, electricHeatingHours, metroTrips]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Direct Biometric & Environmental Quantification</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Personal & Household Impact Engine
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Climate and health choices are often abstract. AeroSense AI computes the exact micrograms of alveolar $PM_{2.5}$ your lungs were spared from, non-smoked cigarette equivalents, and household greenhouse gas emissions diverted through sustainable micro-habits.
          </p>
        </div>
      </div>

      {/* Main 4 Metric Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">Pulmonary PM2.5 Spared</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {inhaledExposure.savedUg.toLocaleString()} <span className="text-xs font-normal text-slate-400">µg</span>
          </div>
          <div className="text-[11px] text-cyan-300/80 font-mono mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{inhaledExposure.exposurePercentReduction}% alveolar dose reduction</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">Cigarettes Avoided</span>
            <Cigarette className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {monthlyCigarettesAvoided} <span className="text-xs font-normal text-slate-400">cigs/mo</span>
          </div>
          <div className="text-[11px] text-amber-300/80 font-mono mt-1">
            ~{dailyCigarettesAvoided} non-inhaled cigarettes / day
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">CO₂ Footprint Diverted</span>
            <Leaf className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {householdSavings.totalCo2Kg} <span className="text-xs font-normal text-slate-400">kg CO₂</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 font-mono mt-1">
            Saved weekly through transit & heating
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-blue-500/30 bg-blue-950/20">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">Urban Forest Offset</span>
            <Trees className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-blue-300 font-mono">
            {householdSavings.treeEquivalents} <span className="text-xs font-normal text-slate-400">trees</span>
          </div>
          <div className="text-[11px] text-blue-300/80 font-mono mt-1">
            Equivalent annual tree carbon absorption
          </div>
        </div>
      </div>

      {/* Interactive Sliders for Customizing Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Customize Your Weekly Sustainable Choices</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Carpool / Ride-share Days per week:</span>
              <span className="text-cyan-400 font-bold">{carpoolDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={carpoolDays}
              onChange={(e) => setCarpoolDays(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-0.5">
              Saves {householdSavings.carpoolCo2Kg} kg CO₂ and {householdSavings.carpoolPm25Grams}g direct tailpipe soot.
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Clean Electric Metro Trips per week:</span>
              <span className="text-cyan-400 font-bold">{metroTrips} trips</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={metroTrips}
              onChange={(e) => setMetroTrips(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-0.5">
              Subterranean corridors avoid 65% of ground-level smog exposure.
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Heat Pump / Inverter Warming instead of Biomass:</span>
              <span className="text-cyan-400 font-bold">{electricHeatingHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={electricHeatingHours}
              onChange={(e) => setElectricHeatingHours(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-0.5">
              Cuts lethal indoor Carbon Monoxide and soot emissions.
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Corsi-Rosenthal / Purifier Run Duration:</span>
              <span className="text-cyan-400 font-bold">{indoorPurifierHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={indoorPurifierHours}
              onChange={(e) => setIndoorPurifierHours(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-0.5">
              Maintains indoor particulate level below 25 µg/m³ threshold.
            </div>
          </div>
        </div>

        {/* Scientific Breakdown Explanation */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Peer-Reviewed Mathematical Grounding</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-cyan-300 font-mono mb-1">
                1. Minute Respiratory Volume Formula
              </div>
              <p>
                Calculated as <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">V_E = Tidal Vol × Resp Rate</code>. During light activity, an adult inhales ~16 liters of air per minute (960 L/hour). In an unmitigated room at 150 µg/m³, you inhale 144 µg of toxic micro-soot hourly.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-amber-300 font-mono mb-1">
                2. Berkeley Earth Cigarette Equivalence
              </div>
              <p>
                Formulated by Prof. Richard Muller: Breathing 22 µg/m³ of PM2.5 for 24 hours delivers the equivalent alveolar lung inflammation and systemic cardiovascular stress of smoking <strong className="text-white">one standard cigarette</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-emerald-300 font-mono mb-1">
                3. The Clean Corridor Effect
              </div>
              <p>
                Switching travel from surface two-wheelers to sealed trains or carpooling avoids the hyper-concentrated vehicle exhaust boundary (&lt; 1 meter from tailpipes), preventing heavy polycyclic aromatic hydrocarbon (PAH) deposition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
