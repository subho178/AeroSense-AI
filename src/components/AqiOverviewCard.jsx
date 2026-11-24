import { AlertOctagon, ShieldAlert, CloudFog, Thermometer, Droplets, Wind, Clock, Volume2 } from 'lucide-react';
import { getAqiCategory } from '../services/aqiService';
import SmogParticleCanvas from './SmogParticleCanvas';

export default function AqiOverviewCard({ city, onPlayVoiceAlert }) {
  const aqi = city.baseAqi;
  const pm25 = city.basePm25;
  const pm10 = city.basePm10;
  const no2 = city.baseNo2;
  const category = getAqiCategory(aqi);

  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl p-6 lg:p-8">
      {/* Background Smog Particle Simulator */}
      <SmogParticleCanvas aqi={aqi} pm25={pm25} />

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Top Badges & Voice advisory trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${category.badge}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${category.badge}`}></span>
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-300">
              {city.isLive ? 'Real-Time Telemetry' : 'Calibrated Inversion Model'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Lat {city.lat.toFixed(2)}, Lon {city.lon.toFixed(2)}
            </span>
          </div>

          <button
            onClick={onPlayVoiceAlert}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 text-cyan-400 border border-cyan-500/30 text-xs font-semibold backdrop-blur transition shadow-sm hover:border-cyan-400"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen to Smog Advisory</span>
          </button>
        </div>

        {/* Hero AQI Score and Category */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className={`flex flex-col items-center justify-center w-36 h-36 rounded-2xl border-2 ${category.border} ${category.bg} shadow-xl backdrop-blur-md relative group`}>
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400 font-medium">
                US AQI
              </span>
              <span className={`text-5xl font-black tracking-tight ${category.color} my-1`}>
                {aqi}
              </span>
              <div className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1">
                <CloudFog className="w-3 h-3" />
                <span>PM2.5: {pm25} µg</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${category.border} ${category.bg} ${category.color}`}>
                  {category.label}
                </span>
                <span className="text-xs font-mono text-rose-400 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded-full">
                  Inversion: {city.inversionRisk}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {city.name}
                <span className="text-cyan-400 font-medium text-lg lg:text-xl ml-2">
                  • {city.state || city.country}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Severe thermal boundary layer traps ground combustion particulates. Ground-level dispersion is minimal until early afternoon.
              </p>
              {city.primarySources && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {city.primarySources.map((src, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono bg-slate-900/90 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Breakthrough Ventilation Safe Window Box */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Solar Ventilation Window</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                      Safe Window
                    </span>
                  </h4>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {city.ventilationWindow}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Solar radiation warms the ground boundary, temporarily lifting the thermal cap. Open cross-windows for 15-20 min <strong className="text-cyan-300">ONLY</strong> during this period to flush CO2 without severe PM2.5 infiltration.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-300/90 font-mono">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>Peak Smog Inversion: {city.peakSmogHours} (Windows must be sealed)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="glass-card rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <CloudFog className="w-3.5 h-3.5 text-rose-400" />
              <span>PM 2.5</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">
              {(pm25 / 15).toFixed(1)}x WHO 24h limit
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <CloudFog className="w-3.5 h-3.5 text-orange-400" />
              <span>PM 10</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </div>
            <div className="text-[10px] text-orange-400 mt-0.5">
              {(pm10 / 45).toFixed(1)}x WHO 24h limit
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Wind className="w-3.5 h-3.5 text-amber-400" />
              <span>NO₂ (Combustion)</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {no2} <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </div>
            <div className="text-[10px] text-amber-400 mt-0.5">
              Traffic & Heating gas
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Surface Temp</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {city.temp}°C
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">
              Winter cold pool
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Humidity</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {city.humidity}%
            </div>
            <div className="text-[10px] text-blue-400 mt-0.5">
              Traps fog droplets
            </div>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Wind className="w-3.5 h-3.5 text-slate-300" />
              <span>Wind Speed</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {city.windKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">
              {city.windKmh < 6 ? 'Calm (No dispersion)' : 'Breezy'}
            </div>
          </div>
        </div>

        {/* Emergency Winter Smog Action Directive (Triggered for Severe Inversion episodes) */}
        {aqi >= 250 && (
          <div className="mt-5 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-rose-300 uppercase tracking-wider font-mono text-[11px]">
                    Severe Smog Emergency Protocol (GRAP IV Equivalent Active)
                  </span>
                  <span className="bg-rose-900/80 text-rose-200 px-1.5 py-0.2 rounded text-[10px] font-mono">
                    High Vulnerability
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2 text-slate-300 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <strong className="text-rose-400 block mb-0.5">1. Schools & Children:</strong>
                    Shift outdoor physical training indoors; keep nursery rooms filtered with CADR &gt; 4 ACH.
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <strong className="text-rose-400 block mb-0.5">2. Commute & Transit:</strong>
                    Avoid open two-wheelers between 07:00–10:30; prioritize underground electric metro transit.
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <strong className="text-rose-400 block mb-0.5">3. Residential Heating:</strong>
                    Strict ban on unvented biomass/wood bonfires; deploy sealed radiator or inverter heat pumps.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
