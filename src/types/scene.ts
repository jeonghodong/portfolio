/**
 * Scene State and Transition Type Definitions
 * Types for managing 3D scene states and transitions
 */

import type { Planet, Project } from "./index";

// Scene modes
export type SceneMode = "spaceship" | "surface";

// Scene state interface
export interface SceneState {
  // Current scene mode
  mode: SceneMode;

  // Planet and project data
  currentPlanet: Planet | null;
  currentProject: Project | null;
  selectedProject: Project | null;

  // Selection states
  selectedPlanetId: string | null;
  hoveredPlanetId: string | null;

  // Transition flags
  isTransitioning: boolean;
  isExiting: boolean;
  isWarpActive: boolean;
  isCameraAnimating: boolean;

  // TV effect flags
  isTVShutoffActive: boolean;
  isTVTurnonActive: boolean;
}

// Transition event types
export type TransitionEvent =
  | "planet_select"
  | "planet_enter"
  | "warp_start"
  | "warp_complete"
  | "surface_enter"
  | "surface_exit"
  | "spaceship_return";

// Transition configuration
export interface TransitionConfig {
  event: TransitionEvent;
  duration: number;
  delay?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

// Scene handlers
export interface SceneHandlers {
  onPlanetSelect: (planetId: string) => void;
  onPlanetHover: (planetId: string | null) => void;
  onPlanetEnter: (planetId: string) => void;
  onWarpComplete: () => void;
  onBackToShip: () => void;
  onFlagClick: () => void;
  onCloseDetail: () => void;
}

// Camera animation states
export interface CameraAnimationState {
  isAnimating: boolean;
  targetPlanetId: string | null;
  progress: number;
}

// Warp animation state
export interface WarpAnimationState {
  isActive: boolean;
  progress: number;
  duration: number;
}

// TV effect state
export interface TVEffectState {
  shutoffActive: boolean;
  turnonActive: boolean;
  progress: number;
}
