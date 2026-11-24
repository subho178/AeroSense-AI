import { memo } from 'react';
import { Wind, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { DEFAULT_CITIES } from '../constants/data';
import { getAqiCategory } from '../services/aqiService';

const NAV_TABS = [
  { id: 'overview', label: 'Smog Intelligence' },
  { id: 'chat', label: 'GenAI Copilot Chat', isAi: true },
  { id: 'routine', label: 'Routine Planner' },
  { id: 'iaq', label: 'IAQ Hacks & DIY Studio' },
  { id: 'vision', label: 'Vision Smog Scanner' },
  { id: 'impact', label: 'Impact & Community' },
];

function Navbar({
  selectedCity,
  onSelectCity,
  aqi,
  onOpenApiKeyModal,
  hasCustomKey,
  isAudioMuted,
  onToggleAudio,
  activeTab,
  onSelectTab
}) {
  const category = getAqiCategory(aqi);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950">
              <Wind className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent">
                  AeroSense AI
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  GenAI v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Winter Smog & Urban Clean Air Navigator
              </p>
            </div>
          </div>

          {/* Quick AQI Badge for Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${category.bg} ${category.color} ${category.border}`}>
              AQI {aqi} • {category.label}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (WCAG 2.1 Tablist compliant) */}
        <nav 
          role="tablist" 
          aria-label="AeroSense primary feature navigation"
          className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none"
        >
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : tab.isAi
                  ? 'text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/40 hover:bg-cyan-900/40 hover:text-cyan-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.isAi && <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Controls: City Selector, Gemini API Key, Voice */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* City Selector with State & Regional Groups */}
          <select
            value={selectedCity.id}
            onChange={(e) => {
              const city = DEFAULT_CITIES.find(c => c.id === e.target.value);
              if (city) onSelectCity(city);
            }}
            aria-label="Select target city or state"
            className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition cursor-pointer max-w-[210px] sm:max-w-[260px] truncate font-medium"
          >
            {Array.from(new Set(DEFAULT_CITIES.map(c => c.region || c.country))).map((region) => (
              <optgroup key={region} label={region} className="bg-slate-950 text-cyan-400 font-bold">
                {DEFAULT_CITIES.filter(c => (c.region || c.country) === region).map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200 font-normal">
                    {c.name} {c.state ? `(${c.state})` : `(${c.country})`}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Audio SOS Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? "Enable Voice Briefing Alerts" : "Mute Voice Briefings"}
            aria-label={isAudioMuted ? "Enable Voice Briefing Alerts" : "Mute Voice Briefings"}
            className={`p-1.5 rounded-lg border transition ${
              isAudioMuted
                ? 'bg-slate-900/80 text-slate-500 border-slate-800 hover:text-slate-300'
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Gemini Key Settings */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              hasCustomKey
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:border-cyan-500/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {hasCustomKey ? 'Gemini Live' : 'AI Model'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
