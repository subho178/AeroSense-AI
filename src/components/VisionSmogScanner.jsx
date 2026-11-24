import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  ShieldAlert, 
  Info,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { analyzeSmogImageWithVision } from '../services/geminiService';
import { validateImageUpload, compressImageClientSide } from '../utils/security';

// Sample pre-loaded test images for quick zero-upload demoing
const PRESET_SCENARIOS = [
  {
    id: 'delhi_smog',
    name: 'Severe Delhi Winter Smog View',
    type: 'outdoor_smog',
    desc: 'Dense thermal inversion haze obscuring buildings at 350 meters.',
    // A compact lightweight base64 placeholder gradient representing outdoor smog
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F/PQAI8wNPvd7v3AAAAABJRU5ErkJggg==',
    previewGradient: 'from-amber-900/60 via-slate-800/80 to-slate-950'
  },
  {
    id: 'kitchen_hazard',
    name: 'Indoor Gas Cooking & Stagnation',
    type: 'indoor_room',
    desc: 'Gas stove running with window latched and purifier blocked in corner.',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    previewGradient: 'from-orange-950/70 via-slate-900 to-slate-950'
  },
  {
    id: 'balcony_seam',
    name: 'Leaky Balcony Window Seams',
    type: 'indoor_room',
    desc: 'Unsealed sliding window leaking outdoor winter particulate into bedroom.',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwGA05i4LgAAAABJRU5ErkJggg==',
    previewGradient: 'from-cyan-950/60 via-slate-900 to-slate-950'
  }
];

export default function VisionSmogScanner({ apiKey }) {
  const [selectedImage, setSelectedImage] = useState(null); // { base64, mimeType, name, previewUrl }
  const [analysisType, setAnalysisType] = useState('outdoor_smog');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const validation = validateImageUpload(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Client-side compression down to 800x800 for optimal performance and Gemini token efficiency
      const compressed = await compressImageClientSide(file, 800, 800, 0.82);
      setSelectedImage({
        base64: compressed.base64,
        mimeType: compressed.mimeType,
        name: file.name,
        previewUrl: compressed.dataUrl
      });
      setScanResult(null);
    } catch (err) {
      console.error('Image compression failed:', err);
      setUploadError('Failed to process image. Please try another photo.');
    }
  };

  const handleSelectPreset = (preset) => {
    setAnalysisType(preset.type);
    setSelectedImage({
      base64: preset.base64,
      mimeType: 'image/png',
      name: preset.name,
      previewGradient: preset.previewGradient
    });
    setScanResult(null);
  };

  const runVisionScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    try {
      const result = await analyzeSmogImageWithVision({
        imageBase64: selectedImage.base64,
        mimeType: selectedImage.mimeType,
        analysisType,
        apiKey
      });
      setScanResult(result);
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Camera className="w-4 h-4" />
            <span>Multimodal Vision Diagnostic AI (Gemini 2.5 Flash)</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Vision Smog & Room Hazard Scanner
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Upload a window view of your city's skyline or a photo of your indoor living room / kitchen setup. AeroSense Vision AI analyzes particulate extinction, optical haze density, air stagnation bottlenecks, and unsealed drafts to deliver instant engineering corrections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Uploader and Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            {/* Mode Toggle */}
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-slate-400 mb-2">
                Scan Target:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAnalysisType('outdoor_smog')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    analysisType === 'outdoor_smog'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Outdoor Window Smog
                </button>
                <button
                  onClick={() => setAnalysisType('indoor_room')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    analysisType === 'indoor_room'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Indoor Room / IAQ Setup
                </button>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div className="relative border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-6 text-center transition bg-slate-900/40 cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  Click or drag photo here
                </div>
                <div className="text-[11px] text-slate-400">
                  PNG, JPG, WebP (Window view or room setup)
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Quick Demo Presets */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                Or test with sample scenarios:
              </div>
              <div className="space-y-2">
                {PRESET_SCENARIOS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.desc}</div>
                    </div>
                    <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Image Preview & Scan Action */}
            {selectedImage && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono truncate max-w-[200px]">Selected: {selectedImage.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Ready for AI scan</span>
                </div>

                {selectedImage.previewUrl ? (
                  <img
                    src={selectedImage.previewUrl}
                    alt="Upload Preview"
                    className="w-full h-36 object-cover rounded-xl border border-slate-800"
                  />
                ) : (
                  <div className={`w-full h-24 rounded-xl bg-gradient-to-r ${selectedImage.previewGradient || 'from-slate-800 to-slate-900'} border border-slate-800 flex items-center justify-center text-xs text-slate-400 font-mono`}>
                    Simulated Scenario Frame
                  </div>
                )}

                <button
                  onClick={runVisionScan}
                  disabled={isScanning}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isScanning ? 'Executing Multimodal Vision Diagnostic...' : 'Analyze Image with Vision AI'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Diagnostic Output */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800 min-h-[420px] flex flex-col justify-center">
            {!scanResult && !isScanning && (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  No Image Analyzed Yet
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload an image or choose one of the sample scenarios on the left, then click <strong>Analyze Image with Vision AI</strong>.
                </p>
              </div>
            )}

            {isScanning && (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin mx-auto" />
                <div className="text-sm font-bold text-white">
                  Scanning atmospheric particulate density...
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Evaluating light extinction coefficient & indoor air barriers
                </div>
              </div>
            )}

            {scanResult && !isScanning && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                      Vision Diagnostic Report
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">
                      {scanResult.hazeDensity || scanResult.roomAssessment}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Hazard Index</div>
                      <div className="text-xl font-black text-rose-400 font-mono">
                        {scanResult.hazardScoreOutOf10} / 10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Optical Observations */}
                {scanResult.estimatedVisibilityMeters && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] uppercase font-mono text-slate-400">
                        Estimated Visibility
                      </div>
                      <div className="text-lg font-bold text-cyan-400 font-mono">
                        &lt; {scanResult.estimatedVisibilityMeters} meters
                      </div>
                    </div>
                    <div className="glass-card p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] uppercase font-mono text-slate-400">
                        Thermal Inversion Trap
                      </div>
                      <div className="text-lg font-bold text-rose-400 font-mono">
                        {scanResult.inversionDetected ? 'Active (Severe)' : 'Low'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Identified Environmental Risks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Identified Hazards & Bottlenecks:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {scanResult.identifiedRisks?.map((risk, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-300 bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-xl flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actionable Engineering Corrections */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Actionable Mitigations & Hacks:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {(scanResult.recommendations || scanResult.diyHacks)?.map((rec, recIdx) => (
                      <li key={recIdx} className="text-xs text-slate-200 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
