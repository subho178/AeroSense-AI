import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Baby, 
  Activity, 
  HeartPulse, 
  Bike, 
  PawPrint, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  Cigarette, 
  CheckCircle
} from 'lucide-react';
import { VULNERABILITY_PROFILES } from '../constants/data';
import { generateAILowEmissionRoutine } from '../services/geminiService';

export default function RoutinePlanner({ city, aqi, pm25, apiKey }) {
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState([
    VULNERABILITY_PROFILES[0], // Infant
    VULNERABILITY_PROFILES[1]  // Asthma
  ]);
  const [commuteMode, setCommuteMode] = useState('Metro & Walking');
  const [dwellingType, setDwellingType] = useState('Apartment (Middle Floor)');
  const [isLoading, setIsLoading] = useState(false);
  const [routineData, setRoutineData] = useState(null);

  const toggleVulnerability = (profile) => {
    if (selectedVulnerabilities.some(p => p.id === profile.id)) {
      setSelectedVulnerabilities(selectedVulnerabilities.filter(p => p.id !== profile.id));
    } else {
      setSelectedVulnerabilities([...selectedVulnerabilities, profile]);
    }
  };

  const configRef = useRef({ selectedVulnerabilities, commuteMode, dwellingType, apiKey, aqi, pm25 });
  configRef.current = { selectedVulnerabilities, commuteMode, dwellingType, apiKey, aqi, pm25 };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await generateAILowEmissionRoutine({
        city,
        aqi,
        pm25,
        vulnerabilityProfiles: selectedVulnerabilities,
        commuteMode,
        homeType: dwellingType,
        apiKey
      });
      setRoutineData(result);
    } catch (err) {
      console.error('Routine generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [city, aqi, pm25, selectedVulnerabilities, commuteMode, dwellingType, apiKey]);

  // Generate on initial load or city change with cancellation to prevent memory leaks
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const cfg = configRef.current;

    generateAILowEmissionRoutine({
      city,
      aqi: cfg.aqi,
      pm25: cfg.pm25,
      vulnerabilityProfiles: cfg.selectedVulnerabilities,
      commuteMode: cfg.commuteMode,
      homeType: cfg.dwellingType,
      apiKey: cfg.apiKey
    }).then(result => {
      if (!isCancelled) {
        setRoutineData(result);
        setIsLoading(false);
      }
    }).catch(err => {
      if (!isCancelled) {
        console.error('Initial routine error:', err);
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [city]);

  const iconMap = {
    Baby,
    Activity,
    HeartPulse,
    Bike,
    PawPrint
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Smog Survival & Low-Emission Daily Routine</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Personalized Daily Clean-Air Protocol
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Standard weather apps advise <em className="text-slate-100">"stay indoors"</em> without considering commutes, child care, or heating needs. AeroSense AI crafts an adaptive hour-by-hour schedule that protects vulnerable family members while slashing household carbon and particulate emissions.
          </p>
        </div>

        {/* Profile Configuration Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <h4 className="text-xs uppercase font-mono font-semibold text-slate-400 mb-3">
            1. Select Family Vulnerability Factors:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {VULNERABILITY_PROFILES.map((profile) => {
              const isSelected = selectedVulnerabilities.some(p => p.id === profile.id);
              const IconComp = iconMap[profile.icon] || Activity;

              return (
                <button
                  key={profile.id}
                  onClick={() => toggleVulnerability(profile)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/80 text-white shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-white">{profile.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {profile.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Commute and Dwelling controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs uppercase font-mono font-semibold text-slate-400 mb-1.5">
                2. Primary Commute Mode
              </label>
              <select
                value={commuteMode}
                onChange={(e) => setCommuteMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Metro & Walking">Metro & Underground Transit</option>
                <option value="Carpooling (Shared EV / Car)">Carpooling (Shared Car / HEPA Cabin)</option>
                <option value="Open 2-Wheeler / Motorbike">Open 2-Wheeler / Motorbike (High Risk)</option>
                <option value="Solo Petrol/Diesel Car">Solo Petrol/Diesel Car</option>
                <option value="Work From Home / Remote">Work From Home / Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono font-semibold text-slate-400 mb-1.5">
                3. Dwelling Architecture
              </label>
              <select
                value={dwellingType}
                onChange={(e) => setDwellingType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Apartment (Middle Floor)">Apartment (Middle Floor - Buffer Sealed)</option>
                <option value="Apartment (Top Floor / Roof)">Apartment (Top Floor - Thermal Loss)</option>
                <option value="Ground Floor House / Villa">Ground Floor House (Ground Soot Exposure)</option>
                <option value="Dense Urban Slum / Semi-Pucca">Dense Urban Corridor (High Ambient Leakage)</option>
              </select>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Synthesizing Atmospheric Routine...' : 'Re-Generate AI Routine'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Routine Results */}
      {routineData && (
        <div className="space-y-6">
          {/* Executive Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-cyan-950/20">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Inhaled PM2.5 Prevented</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {routineData.totalInhaledPm25SavedUg || 380} <span className="text-xs font-normal text-slate-400">µg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Reduced pulmonary alveolar deposition across family members.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold mb-1">
                <Cigarette className="w-4 h-4" />
                <span>Cigarettes Inhalation Avoided</span>
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ~{routineData.equivalentCigarettesAvoided || 2.8} <span className="text-xs font-normal text-slate-400">eq. cigs/day</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Based on Berkeley Earth equivalence model.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold mb-1">
                <Leaf className="w-4 h-4" />
                <span>Household CO₂ Saved</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {routineData.householdCo2SavedKg || 4.6} <span className="text-xs font-normal text-slate-400">kg CO₂</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                By adopting clean commute & eco-heating schedules.
              </p>
            </div>
          </div>

          {/* AI Executive Summary */}
          {routineData.summary && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 font-mono">Meteorological Grounding: </strong>
                {routineData.summary}
              </div>
            </div>
          )}

          {/* Schedule Timeline */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Optimized Diurnal Smog Schedule</span>
            </h3>

            <div className="space-y-4">
              {routineData.schedule?.map((item, idx) => {
                const isCritical = item.exposureRisk === 'Critical';
                const isModerate = item.exposureRisk === 'Moderate';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800/80 font-mono text-xs font-bold text-cyan-400">
                          {item.time}
                        </span>
                        <h4 className="font-bold text-sm text-white">{item.activity}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {item.aqiCondition}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          isCritical
                            ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                            : isModerate
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950/80 text-amber-400 border-amber-800'
                        }`}>
                          {item.exposureRisk} Risk
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-cyan-300 font-mono text-[11px] uppercase tracking-wider mb-0.5">
                            Indoor Air Quality / Protection Hack:
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {item.airQualityHack}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-emerald-300 font-mono text-[11px] uppercase tracking-wider mb-0.5">
                            Low-Emission Sustainable Alternative:
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {item.sustainableAction}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Proactive Recommendations */}
          {routineData.topProactiveHacks && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>AeroSense AI Winter Smog Golden Rules:</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {routineData.topProactiveHacks.map((hack, hIdx) => (
                  <li key={hIdx} className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2">
                    <span className="text-cyan-400 font-mono font-bold mt-0.5">•</span>
                    <span>{hack}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
