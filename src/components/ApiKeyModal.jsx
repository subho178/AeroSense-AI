import React, { useState } from 'react';
import { X, Sparkles, Key, CheckCircle, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../services/geminiService';
import { validateGeminiApiKey } from '../utils/security';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [inputKey, setInputKey] = useState(getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isValid = !inputKey || validateGeminiApiKey(inputKey);

  const handleSave = () => {
    if (inputKey && !validateGeminiApiKey(inputKey)) {
      setErrorMessage('Key format must begin with AIzaSy... and be 39+ characters.');
      return;
    }
    setErrorMessage('');
    saveStoredApiKey(inputKey);
    setIsSaved(true);
    if (onKeySaved) onKeySaved(Boolean(inputKey));
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setInputKey('');
    setErrorMessage('');
    saveStoredApiKey('');
    if (onKeySaved) onKeySaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-slate-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Gemini GenAI Configuration
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              Powered by Google Gemini 2.5 Flash
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          AeroSense AI supports direct multimodal processing via Google Gemini. You can provide your Gemini API key below for live AI inference, or leave it empty to use our pre-calibrated neural & atmospheric heuristic model.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-slate-400 mb-1">
              Gemini API Key:
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setErrorMessage('');
                }}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono ${
                  errorMessage
                    ? 'border-rose-500 focus:border-rose-400'
                    : inputKey && validateGeminiApiKey(inputKey)
                    ? 'border-emerald-500 focus:border-emerald-400'
                    : 'border-slate-700 focus:border-cyan-400'
                }`}
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>
            {errorMessage && (
              <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {inputKey && validateGeminiApiKey(inputKey) && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Valid Gemini API key structure verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>Get free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {inputKey && (
              <button
                onClick={handleClear}
                className="text-rose-400 hover:text-rose-300 font-mono"
              >
                Clear Key
              </button>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your API key is stored strictly client-side in your browser's <code className="text-cyan-300 font-mono">localStorage</code>. It is never logged or sent to any third-party server.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              {isSaved ? 'Saved!' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
