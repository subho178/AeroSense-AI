import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AqiOverviewCard from './components/AqiOverviewCard';
import HourlyInversionChart from './components/HourlyInversionChart';
import RoutinePlanner from './components/RoutinePlanner';
import IaqStudio from './components/IaqStudio';
import VisionSmogScanner from './components/VisionSmogScanner';
import ImpactScorecard from './components/ImpactScorecard';
import CommunityHub from './components/CommunityHub';
import ApiKeyModal from './components/ApiKeyModal';
import ErrorBoundary from './components/ErrorBoundary';
import AiChat from './components/AiChat';

import { DEFAULT_CITIES } from './constants/data';
import { fetchLiveCityAirQuality } from './services/aqiService';
import { getStoredApiKey } from './services/geminiService';
import { speechService } from './services/speechService';
import { Wind, ShieldAlert, Heart, Github, Sparkles, Bot, MessageSquare } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITIES[0]);
  const [cityData, setCityData] = useState(DEFAULT_CITIES[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Initialize and check API key
  useEffect(() => {
    setHasCustomKey(Boolean(getStoredApiKey()));
  }, []);

  // Fetch telemetry when city changes
  useEffect(() => {
    let isMounted = true;
    fetchLiveCityAirQuality(selectedCity).then(data => {
      if (isMounted) {
        setCityData(data);
      }
    });
    return () => { isMounted = false; };
  }, [selectedCity]);

  // Voice alert synthesis
  const handlePlayVoiceAlert = () => {
    if (isAudioMuted) return;

    const locationLabel = cityData.state ? `${cityData.name}, ${cityData.state}` : cityData.name;
    const alertText = `AeroSense AI Winter Smog Advisory for ${locationLabel}. Current Air Quality Index is ${cityData.baseAqi}, which is in the severe hazardous category. Ground-level thermal inversion is actively trapping vehicular soot and particulate matter. Please keep exterior windows sealed until the midday ventilation window between ${cityData.ventilationWindow}. Run indoor Corsi-Rosenthal filtration or HEPA purifiers continuously, and ensure vulnerable individuals avoid morning outdoor exertion.`;

    speechService.speak(alertText);
  };

  const handleToggleAudio = () => {
    if (!isAudioMuted) {
      speechService.stop();
      setIsAudioMuted(true);
    } else {
      setIsAudioMuted(false);
      handlePlayVoiceAlert();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        aqi={cityData.baseAqi}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={hasCustomKey}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area wrapped in ErrorBoundary & WCAG Tabpanel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        <ErrorBoundary>
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            className="focus:outline-none"
          >
            {/* Tab 1: Smog Intelligence Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <AqiOverviewCard
                  city={cityData}
                  onPlayVoiceAlert={handlePlayVoiceAlert}
                />

                <HourlyInversionChart
                  hourlyData={cityData.hourly}
                />

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="glass-card-hover p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 text-left transition relative group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">Core GenAI</span>
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                    <h4 className="font-extrabold text-sm text-white mb-1">AI Copilot Chat</h4>
                    <p className="text-xs text-slate-300">
                      Conversational assistant for infant safety, asthma care, and DIY purifiers.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('routine')}
                    className="glass-card-hover p-4 sm:p-5 rounded-2xl border border-slate-800 text-left transition"
                  >
                    <div className="text-xs font-mono font-bold text-cyan-400 mb-1">Module 01</div>
                    <h4 className="font-extrabold text-sm text-white mb-1">Routine Planner</h4>
                    <p className="text-xs text-slate-400">
                      Hour-by-hour schedules with commute and heating optimizations.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('iaq')}
                    className="glass-card-hover p-4 sm:p-5 rounded-2xl border border-slate-800 text-left transition"
                  >
                    <div className="text-xs font-mono font-bold text-emerald-400 mb-1">Module 02</div>
                    <h4 className="font-extrabold text-sm text-white mb-1">DIY Corsi Studio</h4>
                    <p className="text-xs text-slate-400">
                      Build 550 CFM MERV 13 filtration for $75 + room IAQ hacks.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('vision')}
                    className="glass-card-hover p-4 sm:p-5 rounded-2xl border border-slate-800 text-left transition"
                  >
                    <div className="text-xs font-mono font-bold text-purple-400 mb-1">Module 03</div>
                    <h4 className="font-extrabold text-sm text-white mb-1">Vision Smog Scanner</h4>
                    <p className="text-xs text-slate-400">
                      Upload skyline or kitchen photo for optical haze & draft diagnosis.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('impact')}
                    className="glass-card-hover p-4 sm:p-5 rounded-2xl border border-slate-800 text-left transition"
                  >
                    <div className="text-xs font-mono font-bold text-amber-400 mb-1">Module 04</div>
                    <h4 className="font-extrabold text-sm text-white mb-1">Impact & Community</h4>
                    <p className="text-xs text-slate-400">
                      Calculate non-inhaled cigarettes & send WhatsApp smog alerts.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Generative AI Chat Copilot */}
            {activeTab === 'chat' && (
              <div className="animate-in fade-in duration-300">
                <AiChat
                  city={cityData}
                  aqi={cityData.baseAqi}
                  pm25={cityData.basePm25}
                  apiKey={getStoredApiKey()}
                />
              </div>
            )}

            {/* Tab 3: GenAI Low-Emission Routine Planner */}
            {activeTab === 'routine' && (
              <div className="animate-in fade-in duration-300">
                <RoutinePlanner
                  city={cityData}
                  aqi={cityData.baseAqi}
                  pm25={cityData.basePm25}
                  apiKey={getStoredApiKey()}
                />
              </div>
            )}

            {/* Tab 3: Indoor Air Quality & DIY Corsi-Rosenthal Studio */}
            {activeTab === 'iaq' && (
              <div className="animate-in fade-in duration-300">
                <IaqStudio />
              </div>
            )}

            {/* Tab 4: Vision Smog & Room Hazard Scanner */}
            {activeTab === 'vision' && (
              <div className="animate-in fade-in duration-300">
                <VisionSmogScanner
                  apiKey={getStoredApiKey()}
                />
              </div>
            )}

            {/* Tab 5: Direct Impact & Community Action Hub */}
            {activeTab === 'impact' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <ImpactScorecard
                  pm25={cityData.basePm25}
                />
                <CommunityHub
                  city={cityData}
                  aqi={cityData.baseAqi}
                  pm25={cityData.basePm25}
                />
              </div>
            )}
          </div>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 lg:px-8 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">AeroSense AI</span>
            <span>• Winter Smog & Community Resilience Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Open-Meteo & WAQI Grounded</span>
            <span>•</span>
            <span>UC Davis Corsi-Rosenthal Efficacy</span>
            <span>•</span>
            <span>Berkeley Earth Cigarette Metric</span>
          </div>
        </div>
      </footer>

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(hasKey) => setHasCustomKey(hasKey)}
      />

      {/* Persistent Floating GenAI Chat Assistant (Visible Across All Tabs) */}
      <div className="fixed bottom-6 right-6 z-40">
        {isFloatingChatOpen ? (
          <div className="w-[360px] sm:w-[440px] h-[580px] rounded-3xl overflow-hidden shadow-2xl glass-panel border border-cyan-500/40 animate-in slide-in-from-bottom-5 duration-200">
            <AiChat
              city={cityData}
              aqi={cityData.baseAqi}
              pm25={cityData.basePm25}
              apiKey={getStoredApiKey()}
              isDrawer={true}
              onCloseDrawer={() => setIsFloatingChatOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsFloatingChatOpen(true)}
            aria-label="Open AeroSense AI Copilot Chat"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <span className="hidden sm:inline">Ask AeroSense AI</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-950/20 text-[10px] font-mono">
              Live Chat
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
