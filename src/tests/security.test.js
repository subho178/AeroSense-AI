import { describe, it, expect } from 'vitest';
import { 
  validateGeminiApiKey, 
  sanitizeText, 
  safeParseGeminiJson,
  validateImageUpload 
} from '../utils/security';

describe('Security & Input Sanitization Utilities', () => {
  it('validates Google Gemini API key format correctly', () => {
    // Valid standard pattern
    expect(validateGeminiApiKey('AIzaSyA1234567890abcdefghijklmnopqrst')).toBe(true);

    // Invalid keys
    expect(validateGeminiApiKey('')).toBe(false);
    expect(validateGeminiApiKey('sk-1234567890')).toBe(false);
    expect(validateGeminiApiKey('AIzaSy_short')).toBe(false);
    expect(validateGeminiApiKey(null)).toBe(false);
  });

  it('sanitizes malicious script tags and HTML injection vectors', () => {
    const malicious = '<script>alert("XSS")</script>&"test"';
    const clean = sanitizeText(malicious);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('&lt;script&gt;');
    expect(clean).toContain('&amp;');
    expect(clean).toContain('&quot;');
  });

  it('safely extracts and parses JSON from markdown code blocks or surrounding commentary', () => {
    const llmOutput = `Here is your requested atmospheric analysis:
\`\`\`json
{
  "aqi": 340,
  "hazard": "Severe Inversion",
  "safe": false
}
\`\`\`
Take care!`;

    const parsed = safeParseGeminiJson(llmOutput);
    expect(parsed).toEqual({
      aqi: 340,
      hazard: 'Severe Inversion',
      safe: false
    });

    // Test with malformed input and fallback
    expect(safeParseGeminiJson('Random garbage text', { fallback: true })).toEqual({ fallback: true });
  });

  it('enforces file type whitelist and size constraints on image uploads', () => {
    // Valid image mock
    const validFile = { type: 'image/jpeg', size: 1024 * 1024 }; // 1MB
    expect(validateImageUpload(validFile).valid).toBe(true);

    // Invalid MIME type
    const exeFile = { type: 'application/x-msdownload', size: 500 };
    expect(validateImageUpload(exeFile).valid).toBe(false);

    // Oversized file (>10MB)
    const bigFile = { type: 'image/png', size: 12 * 1024 * 1024 };
    expect(validateImageUpload(bigFile).valid).toBe(false);
  });
});
