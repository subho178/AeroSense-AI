/**
 * Security and sanitization utilities for AeroSense AI
 * Protects against XSS, validates client-side Gemini API keys,
 * safely parses LLM JSON outputs, and validates/resizes image uploads.
 */

// Official Google Gemini API key prefix and pattern
const GEMINI_API_KEY_REGEX = /^AIzaSy[A-Za-z0-9_-]{30,45}$/;

/**
 * Validates whether a given string is formatted as a valid Google Gemini API key.
 * @param {string} key 
 * @returns {boolean}
 */
export function validateGeminiApiKey(key) {
  if (!key || typeof key !== 'string') return false;
  return GEMINI_API_KEY_REGEX.test(key.trim());
}

/**
 * Sanitizes plain text input to neutralize potential script tags or HTML injection.
 * @param {string} input 
 * @returns {string}
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safely extracts and parses JSON objects from LLM text responses,
 * even when wrapped in markdown codeblocks (```json ... ```) or with surrounding commentary.
 * @param {string} rawText 
 * @param {*} fallback 
 * @returns {*}
 */
export function safeParseGeminiJson(rawText, fallback = null) {
  if (!rawText || typeof rawText !== 'string') return fallback;

  try {
    // 1. Try direct parse if clean
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return JSON.parse(trimmed);
    }

    // 2. Extract balanced JSON block using regex or bracket matcher
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || trimmed.match(/(\{[\s\S]*\})/);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
  } catch (err) {
    console.warn('safeParseGeminiJson failed to parse LLM text:', err);
  }

  return fallback;
}

// Allowed image MIME types for Vision AI
export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

/**
 * Validates an uploaded File against MIME whitelist and maximum size.
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageUpload(file) {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type "${file.type}". Please upload a JPEG, PNG, or WebP image.` 
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `File size exceeds ${(MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB limit.` 
    };
  }

  return { valid: true };
}

/**
 * Resizes and compresses an image file client-side before base64 encoding.
 * Reduces an 8MB camera capture to ~80KB, drastically saving bandwidth,
 * avoiding browser memory bloat, and accelerating Gemini Vision API latency.
 * 
 * @param {File} file 
 * @param {number} maxWidth Max bounding width in px
 * @param {number} maxHeight Max bounding height in px
 * @param {number} quality JPEG quality 0.0 - 1.0
 * @returns {Promise<{ base64: string, mimeType: string, width: number, height: number, dataUrl: string }>}
 */
export function compressImageClientSide(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Corrupted or invalid image data.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];

        resolve({
          base64,
          mimeType: 'image/jpeg',
          width,
          height,
          dataUrl
        });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}
