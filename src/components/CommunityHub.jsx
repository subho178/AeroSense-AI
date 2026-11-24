import { useState, useMemo, useCallback } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Car, 
  MessageSquareShare 
} from 'lucide-react';
import { CLEAN_COMMUTE_ALTERNATIVES } from '../constants';

export default function CommunityHub({ city, aqi, pm25 }) {
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [communityCount, setCommunityCount] = useState(120); // Participating families

  // Neighborhood broadcast template - memoized to prevent re-creation
  const alertBroadcastMessage = useMemo(() => {
    return `🚨 [AeroSense Community Smog Alert] - ${city.name}${city.state ? ` (${city.state})` : ''}
━━━━━━━━━━━━━━━━━━━
⚠️ AQI Status: ${aqi} (Hazardous Winter Smog)
🌫️ PM2.5 Level: ${pm25} µg/m³ (${(pm25/15).toFixed(0)}x WHO limit)
🌡️ Inversion Warning: Ground-level thermal inversion cap active. 

🏠 COMMUNITY SAFETY DIRECTIVE:
1. Keep building windows SEALED until midday (${city.ventilationWindow}).
2. Toddlers, seniors, and asthma patients must avoid morning outdoor walks.
3. Carpool or use Metro corridors to avoid cold engine pollution spikes.
4. Run Corsi-Rosenthal DIY boxes or HEPA purifiers continuously.

🌳 Collective Clean Air Action: We are currently saving ${Math.round(communityCount * 3.8)} kg CO2 daily together!
#AeroSenseAI #CleanAirResilience`;
  }, [city.name, city.state, city.ventilationWindow, aqi, pm25, communityCount]);

  const handleCopyAlert = useCallback(() => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(alertBroadcastMessage).catch(() => {});
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    }
  }, [alertBroadcastMessage]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Collective Smog Defense & Community Corridors</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Community Smog Action & SOS Hub
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Severe air pollution is an urban tragedy of the commons. When families coordinate staggered travel, share low-emission carpools, and circulate synchronized safety alerts, localized ground-level toxic peaks drop dramatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI-Generated Community Smog Alert Broadcast */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Neighborhood Broadcast Generator
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Instant WhatsApp & Building Notice Template
              </h3>
            </div>

            <button
              onClick={handleCopyAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-sm"
            >
              {copiedAlert ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAlert ? 'Copied to Clipboard!' : 'Copy Alert'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 whitespace-pre-wrap leading-relaxed select-all">
            {alertBroadcastMessage}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <MessageSquareShare className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Share this pre-grounded meteorological advisory to your neighborhood RWA, school parents chat, or apartment building group.</span>
          </div>
        </div>

        {/* Right Column: Collective Impact Multiplier */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
              Collective Multiplier
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Neighborhood Action Scoreboard
            </h3>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Participating Neighborhood Families:</span>
              <span className="text-emerald-400 font-bold">{communityCount} households</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={communityCount}
              onChange={(e) => setCommunityCount(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Aggregated Stats */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Collective CO₂ Prevented</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {Math.round(communityCount * 4.6 * 7)} kg / week
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Tailpipe Soot Emissions Diverted</span>
              <span className="text-base font-bold text-cyan-400 font-mono">
                {(communityCount * 0.12 * 7).toFixed(1)} kg PM2.5
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Avoided Pediatric ER Visits</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                ~{Math.max(1, Math.round(communityCount * 0.04))} admissions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Commute & Micro-Habit Alternatives Table */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-cyan-400" />
          <span>Neighborhood Clean-Air Alternative Switches</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLEAN_COMMUTE_ALTERNATIVES.map((alt, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-rose-400 font-bold mb-1">
                High-Pollution Habit
              </div>
              <div className="text-xs font-bold text-slate-300 line-through opacity-80 mb-3">
                {alt.currentMode}
              </div>

              <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold mb-1">
                AeroSense Sustainable Switch
              </div>
              <div className="text-sm font-bold text-white mb-2">
                {alt.alternative}
              </div>

              <div className="text-xs text-cyan-300/90 font-mono mb-2 bg-cyan-950/60 p-2 rounded-lg border border-cyan-800/60">
                {alt.exposureReduction}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>{alt.emissionSavedKgCo2PerDay} kg CO₂ / day saved</span>
                <span className="text-emerald-400">${alt.fuelSavedUsdPerDay} saved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
