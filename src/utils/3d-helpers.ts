/**
 * 3D Graphics Helper Functions
 * Utility functions for Three.js operations
 */

import type { Vector3Tuple } from "@/src/types/3d";

/**
 * Generate random position in circular distribution
 */
export function generateCircularPosition(
  minRadius: number,
  maxRadius: number,
  height: number = 0
): Vector3Tuple {
  const angle = Math.random() * Math.PI * 2;
  const radius = minRadius + Math.random() * (maxRadius - minRadius);

  return [Math.cos(angle) * radius, height, Math.sin(angle) * radius];
}

/**
 * Generate random position in spherical distribution
 */
export function generateSphericalPosition(
  minRadius: number,
  maxRadius: number
): Vector3Tuple {
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);

  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ];
}

/**
 * Calculate terrain noise (simplified Perlin-like noise)
 */
export function calculateTerrainNoise(
  x: number,
  z: number,
  scale: number = 0.1,
  octaves: number = 2
): number {
  let noise = 0;
  let amplitude = 1;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    noise +=
      (Math.sin(x * scale * frequency) * Math.cos(z * scale * frequency) +
        Math.sin((x + z) * scale * frequency * 0.5)) *
      amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return noise;
}

/**
 * Apply edge fade to terrain height
 */
export function applyEdgeFade(
  height: number,
  distance: number,
  maxDistance: number
): number {
  const fadeFactor = Math.max(0, 1 - distance / maxDistance);
  return height * fadeFactor;
}

/**
 * Lerp between two numbers
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Ease out cubic
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in out cubic
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculate distance between two 2D points
 */
export function distance2D(
  x1: number,
  z1: number,
  x2: number,
  z2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
}

/**
 * Normalize vector to unit length
 */
export function normalizeVector3(
  x: number,
  y: number,
  z: number
): Vector3Tuple {
  const length = Math.sqrt(x * x + y * y + z * z);
  if (length === 0) return [0, 0, 0];
  return [x / length, y / length, z / length];
}

/**
 * Get random value in range
 */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Get random int in range (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * Choose random item from array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
