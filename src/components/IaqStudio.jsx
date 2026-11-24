import React, { useState } from 'react';
import { 
  Box, 
  Wind, 
  DollarSign, 
  Volume2, 
  CheckCircle2, 
  Flame, 
  BedDouble, 
  Sofa, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  ChevronRight,
  Gauge
} from 'lucide-react';
import { CORSI_ROSENTHAL_PRESETS, IAQ_ROOM_HACKS } from '../constants/data';

export default function IaqStudio() {
  const [selectedPreset, setSelectedPreset] = useState(CORSI_ROSENTHAL_PRESETS[0]);
  const [roomSqFt, setRoomSqFt] = useState(450);
  const [ceilingHeightFt, setCeilingHeightFt] = useState(9);
  const [activeRoomTab, setActiveRoomTab] = useState('Kitchen');

  // Math for Air Changes per Hour (ACH)
  // ACH = (CADR in CFM * 60) / Room Volume in cubic feet
  const roomVolumeCuFt = roomSqFt * ceilingHeightFt;
  const ach = ((selectedPreset.cadrCfm * 60) / roomVolumeCuFt).toFixed(1);
  const isOptimalAch = ach >= 4.0; // ASHRAE/CDC recommendation is > 4 to 6 ACH during epidemic/smog

  const activeRoomData = IAQ_ROOM_HACKS.find(r => r.room === activeRoomTab) || IAQ_ROOM_HACKS[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Box className="w-4 h-4" />
            <span>Open-Source IAQ Engineering & Filtration Hacks</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            DIY Corsi-Rosenthal Box Studio & Room IAQ Hacks
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Commercial HEPA purifiers are expensive and struggle with CADR in larger family rooms. The Corsi-Rosenthal box, validated by aerosol scientists at UC Davis, provides <strong className="text-cyan-300">550+ CFM of MERV 13 clean air delivery</strong> for a fraction of the cost, eliminating up to 95% of airborne winter smog.
          </p>
        </div>
      </div>

      {/* Interactive Corsi-Rosenthal Box Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Selector and Room Dimension Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Select Corsi-Rosenthal Architecture:</span>
            </h3>

            <div className="space-y-3">
              {CORSI_ROSENTHAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    selectedPreset.id === preset.id
                      ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{preset.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      ${preset.costUsd} DIY
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>{preset.cadrCfm} CFM CADR</span>
                    <span>•</span>
                    <span>{preset.filterRating}</span>
                    <span>•</span>
                    <span>{preset.noiseDb} dB</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Room Dimensions Sliders */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Target Room Floor Area:</span>
                  <span className="text-cyan-400 font-bold">{roomSqFt} sq ft</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="25"
                  value={roomSqFt}
                  onChange={(e) => setRoomSqFt(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Ceiling Height:</span>
                  <span className="text-cyan-400 font-bold">{ceilingHeightFt} ft</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="14"
                  step="0.5"
                  value={ceilingHeightFt}
                  onChange={(e) => setCeilingHeightFt(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Bill of Materials (BOM) */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bill of Materials & DIY Components:</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedPreset.materials.map((mat, mIdx) => (
                <li key={mIdx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-cyan-400 font-mono font-bold">•</span>
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Live Performance Simulator & Cost Comparison */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Air Exchange & CADR Engineering
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {selectedPreset.name} Performance
                </h3>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                isOptimalAch
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950/80 text-amber-400 border-amber-800'
              }`}>
                {ach} ACH ({isOptimalAch ? 'Optimal Clean Air Rate' : 'Moderate Flow'})
              </div>
            </div>

            {/* Performance Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card p-3.5 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Air Changes / Hour</div>
                <div className="text-2xl font-black text-cyan-400 font-mono my-1">{ach}</div>
                <div className="text-[10px] text-slate-400">Rec: &gt; 4.0 ACH</div>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Total CADR</div>
                <div className="text-2xl font-black text-emerald-400 font-mono my-1">
                  {selectedPreset.cadrCfm} <span className="text-xs font-normal text-slate-400">CFM</span>
                </div>
                <div className="text-[10px] text-slate-400">Clean Air Flow</div>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Noise Level</div>
                <div className="text-2xl font-black text-slate-200 font-mono my-1">
                  {selectedPreset.noiseDb} <span className="text-xs font-normal text-slate-400">dB</span>
                </div>
                <div className="text-[10px] text-slate-400">Speed 1 Quiet</div>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Filter Life</div>
                <div className="text-2xl font-black text-amber-400 font-mono my-1">
                  {selectedPreset.filterLifespanMonths} <span className="text-xs font-normal text-slate-400">Mo</span>
                </div>
                <div className="text-[10px] text-slate-400">Smog Season Full</div>
              </div>
            </div>

            {/* Cost Comparison vs Commercial Purifier */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-5">
              <h4 className="text-xs uppercase font-mono font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Economic & Efficiency ROI Analysis</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-semibold mb-1">DIY Corsi-Rosenthal Box</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    ${selectedPreset.costUsd}
                  </div>
                  <div className="text-xs text-emerald-300/80 font-mono mt-1">
                    Efficacy: {selectedPreset.cadrPerDollar}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {selectedPreset.advantages}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Commercial HEPA Equivalent</div>
                  <div className="text-3xl font-black text-slate-300 font-mono line-through opacity-70">
                    ${selectedPreset.commercialEquivalentCost}
                  </div>
                  <div className="text-xs text-rose-400 font-mono mt-1">
                    Saves ${selectedPreset.commercialEquivalentCost - selectedPreset.costUsd} (
                    {Math.round(((selectedPreset.commercialEquivalentCost - selectedPreset.costUsd) / selectedPreset.commercialEquivalentCost) * 100)}% savings)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Commercial units also charge $80-120 per proprietary filter replacement.
                  </p>
                </div>
              </div>
            </div>

            {/* Shroud Rule Visual Tip */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-300 font-bold">The Cardboard Fan Shroud Secret: </strong>
                Standard box fan corners experience aerodynamic backflow. Taping a 15-inch circular cardboard cutout (a "shroud") to the front face reduces eddy recirculation and boosts CADR airflow by <strong className="text-white">over 20%</strong> without adding any electricity draw.
              </div>
            </div>

            {/* Interactive Step-by-Step DIY Assembly Blueprint */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs uppercase font-mono font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Step-by-Step DIY Assembly Blueprint:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">1</span>
                    <span>Baseplate Preparation</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Cut a 20"x20" corrugated cardboard sheet as the sealed bottom floor. Ensure no puncture holes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">2</span>
                    <span>Airflow Arrow Alignment</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Form a 4-wall cube. <strong>Crucial:</strong> Airflow arrows on all filters must point <span className="text-cyan-300 font-bold">INWARD</span> toward the center chamber.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">3</span>
                    <span>Fan Mount & Shroud</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Place box fan blowing <span className="text-emerald-400 font-bold">UPWARD</span>. Tape a 15-inch circular cardboard shroud over the outer corners of the front grill.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">4</span>
                    <span>Hermetic Edge Sealing</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Duct tape all 8 corner seams completely airtight so zero unpurified bypass air enters without passing through MERV 13 media.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room-by-Room IAQ Hacks Section */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Room-by-Room Defense
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Targeted Indoor Air Quality Protocols
            </h3>
          </div>

          {/* Room Selector Pills */}
          <div className="flex items-center gap-2">
            {IAQ_ROOM_HACKS.map((r) => (
              <button
                key={r.room}
                onClick={() => setActiveRoomTab(r.room)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeRoomTab === r.room
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {r.room}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Room Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {activeRoomData.actions.map((act, aIdx) => (
            <div
              key={aIdx}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                0{aIdx + 1}
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">{act.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{act.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
