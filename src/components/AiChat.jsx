import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCcw, 
  X, 
  ShieldAlert, 
  Wind, 
  Flame, 
  Baby, 
  Activity, 
  Clock
} from 'lucide-react';
import { sendAeroSenseChatMessage } from '../services/geminiService';
import { speechService } from '../services/speechService';

const SUGGESTED_QUESTIONS = [
  { icon: Baby, label: 'Toddler & Child Safety', query: 'How to protect my 1-year-old child and infants at home today?' },
  { icon: Activity, label: 'Outdoor Workout / Jogging', query: 'Can I go for an outdoor morning run or cycling today?' },
  { icon: Wind, label: 'DIY Air Purifier (< ₹2,000)', query: 'How do I build a DIY Corsi-Rosenthal air purifier box step-by-step?' },
  { icon: Flame, label: 'Cooking & Kitchen PM2.5 Hacks', query: 'What cooking hacks can prevent indoor PM2.5 and gas stove spikes?' },
  { icon: Clock, label: 'Safe Ventilation Window', query: 'When is the exact safe window to open my windows today?' },
  { icon: ShieldAlert, label: 'Scratchy Throat & Cough', query: 'My throat is scratchy and chest feels tight, what immediate relief steps can I take?' }
];

export default function AiChat({
  city,
  aqi,
  pm25,
  apiKey,
  isDrawer = false,
  onCloseDrawer = null
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **AeroSense AI Copilot**, your real-time winter smog and clean-air guide for **${city.name}**.\n\nCurrently, the local AQI stands at **${aqi}** ($PM_{2.5}: ${pm25}\\,\\mu g/m^3$, ${city.inversionRisk}). The safe sunlight ventilation window is **${city.ventilationWindow}**.\n\nAsk me anything about daily routines, child & asthma protection, indoor air quality hacks, DIY air purifiers, or sustainable clean commute alternatives!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [vocalizingMsgId, setVocalizingMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, scrollToBottom]);

  // Reset chat welcome message when selected city changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${city.id}`,
        sender: 'assistant',
        text: `Hello! I am **AeroSense AI Copilot**, your real-time winter smog and clean-air guide for **${city.name}**.\n\nCurrently, the local AQI stands at **${aqi}** ($PM_{2.5}: ${pm25}\\,\\mu g/m^3$, ${city.inversionRisk}). The safe sunlight ventilation window is **${city.ventilationWindow}**.\n\nAsk me anything about daily routines, child & asthma protection, indoor air quality hacks, DIY air purifiers, or sustainable clean commute alternatives!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [city.id, city.name, city.inversionRisk, city.ventilationWindow, aqi, pm25]);

  // Handle sending a message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isGenerating) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsGenerating(true);

    try {
      const replyText = await sendAeroSenseChatMessage({
        messages: newHistory,
        city,
        aqi,
        pm25,
        apiKey
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat generation error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue processing your request. Please try again or check your Gemini API key.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVocalize = (msg) => {
    if (vocalizingMsgId === msg.id) {
      speechService.stop();
      setVocalizingMsgId(null);
    } else {
      // Strip markdown hashes and asterisks for smooth vocalization
      const cleanText = msg.text.replace(/[#*`_~]/g, '');
      speechService.speak(cleanText, () => setVocalizingMsgId(null));
      setVocalizingMsgId(msg.id);
    }
  };

  const handleCopy = (msg) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(msg.text).catch(() => {});
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  const handleResetChat = () => {
    speechService.stop();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset. Ready to assist you in **${city.name}** with real-time smog guidance and indoor air protection hacks!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className={`flex flex-col ${isDrawer ? 'h-full' : 'h-[750px] glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden'}`}>
      {/* Header */}
      <div className="p-4 lg:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">AeroSense GenAI Copilot</h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {apiKey ? 'Gemini 2.5 Live' : 'Neural Specialist'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>{city.name}</span>
              <span>•</span>
              <span className="text-rose-400 font-mono font-bold">AQI {aqi}</span>
              <span>•</span>
              <span className="text-cyan-400 font-mono">Vent: {city.ventilationWindow}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            title="Reset conversation"
            aria-label="Reset conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isDrawer && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              title="Close chat drawer"
              aria-label="Close chat drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Inquiry Chips */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 shrink-0">
          Suggested:
        </span>
        {SUGGESTED_QUESTIONS.map((chip, idx) => {
          const IconC = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 shrink-0 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <IconC className="w-3 h-3 text-cyan-400" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Footer Controls */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVocalize(msg)}
                        title={vocalizingMsgId === msg.id ? "Stop voice readout" : "Listen to answer"}
                        aria-label={vocalizingMsgId === msg.id ? "Stop voice readout" : "Listen to answer"}
                        className="hover:text-cyan-400 transition"
                      >
                        {vocalizingMsgId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg)}
                        title="Copy text"
                        aria-label="Copy text"
                        className="hover:text-cyan-400 transition"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>AeroSense AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 lg:p-4 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask AeroSense AI anything about ${city.name}'s smog or indoor defense...`}
            disabled={isGenerating}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold disabled:opacity-40 transition shadow-md shadow-cyan-500/20 shrink-0"
            title="Send Message"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
