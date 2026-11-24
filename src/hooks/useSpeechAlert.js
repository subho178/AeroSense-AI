import { useState, useCallback } from 'react';
import { speechService } from '../services/speechService';

/**
 * Custom React hook for vocalizing emergency smog advisories.
 * Manages mute state, speech synthesis playback, and cancellation.
 * 
 * @param {Object} cityData 
 * @returns {{ isAudioMuted: boolean, toggleAudio: Function, playAdvisory: Function }}
 */
export function useSpeechAlert(cityData) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const playAdvisory = useCallback(() => {
    if (isAudioMuted || !cityData) return;

    const locationLabel = cityData.state ? `${cityData.name}, ${cityData.state}` : cityData.name;
    const alertText = `AeroSense AI Winter Smog Advisory for ${locationLabel}. Current Air Quality Index is ${cityData.baseAqi}, which is in the severe hazardous category. Ground-level thermal inversion is actively trapping vehicular soot and particulate matter. Please keep exterior windows sealed until the midday ventilation window between ${cityData.ventilationWindow}. Run indoor Corsi-Rosenthal filtration or HEPA purifiers continuously, and ensure vulnerable individuals avoid morning outdoor exertion.`;

    speechService.speak(alertText);
  }, [cityData, isAudioMuted]);

  const toggleAudio = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (next) {
        speechService.stop();
      } else {
        // Trigger play on unmute
        setTimeout(() => playAdvisory(), 100);
      }
      return next;
    });
  }, [playAdvisory]);

  return {
    isAudioMuted,
    toggleAudio,
    playAdvisory
  };
}
