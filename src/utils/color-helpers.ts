/**
 * Color Helper Functions
 * Utility functions for color manipulation
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Lerp between two colors (hex format)
 */
export function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return rgbToHex(r, g, b);
}

/**
 * Adjust color brightness
 */
export function adjustBrightness(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const r = Math.min(255, Math.max(0, rgb.r + amount));
  const g = Math.min(255, Math.max(0, rgb.g + amount));
  const b = Math.min(255, Math.max(0, rgb.b + amount));

  return rgbToHex(r, g, b);
}

/**
 * Get random star color (white, blue-ish, or yellow-ish)
 */
export function getRandomStarColor(): [number, number, number] {
  const colorChoice = Math.random();

  if (colorChoice < 0.7) {
    // White stars
    return [1, 1, 1];
  } else if (colorChoice < 0.85) {
    // Blue-ish stars
    return [0.8, 0.9, 1];
  } else {
    // Yellow-ish stars
    return [1, 0.95, 0.8];
  }
}
