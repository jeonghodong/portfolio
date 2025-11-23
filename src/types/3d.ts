/**
 * 3D Graphics Type Definitions
 * Common types for Three.js and React Three Fiber
 */

// Vector and position types
export type Vector3Tuple = [number, number, number];
export type Vector2Tuple = [number, number];
export type EulerTuple = [number, number, number];

// Transform types
export interface Transform3D {
  position: Vector3Tuple;
  rotation: EulerTuple;
  scale?: Vector3Tuple | number;
}

// Geometry configuration
export type GeometryDetail = "low" | "medium" | "high";

export interface GeometryConfig {
  detail: GeometryDetail;
  segments: number;
  radius: number;
}

// Material properties
export interface MaterialConfig {
  color: string;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
}

// Camera types
export interface CameraConfig {
  position: Vector3Tuple;
  fov: number;
  near?: number;
  far?: number;
  lookAt?: Vector3Tuple;
}

// Controls configuration
export interface OrbitControlsConfig {
  enabled?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  zoomSpeed?: number;
  rotateSpeed?: number;
  panSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
  target?: Vector3Tuple;
  enableDamping?: boolean;
  dampingFactor?: number;
}

// Particle system types
export interface ParticleSystemConfig {
  count: number;
  size: number;
  sizeMin?: number;
  sizeMax?: number;
  color: string;
  opacity?: number;
  speed?: number;
  radius?: number;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string | number[];
  loop?: boolean;
}

export interface SpringConfig {
  tension: number;
  friction: number;
}

// Light types
export interface LightConfig {
  color: string;
  intensity: number;
  position?: Vector3Tuple;
  castShadow?: boolean;
}

// Screen/Display types
export interface ScreenPosition {
  x: number;
  y: number;
  z: number;
}

export interface HologramScreenConfig {
  position: Vector3Tuple;
  rotation: EulerTuple;
  scale?: number;
  isActive?: boolean;
}
