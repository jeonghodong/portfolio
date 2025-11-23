/**
 * Animation and Timing Configuration
 * Centralized constants for all animation timings and transitions
 */

export const TRANSITION_TIMING = {
  // Scene transitions
  PLANET_SELECT_DURATION: 1000, // ms
  PLANET_EXIT_DURATION: 2000, // ms
  WARP_ANIMATION_DURATION: 3000, // ms

  // TV effect timing
  TV_TURNOFF_DURATION: 2000, // ms
  TV_TURNON_DURATION: 100, // ms
  TV_TURNON_DELAY: 100, // ms

  // Modal animations
  MODAL_OPEN_DURATION: 300, // ms
  MODAL_CLOSE_DURATION: 200, // ms

  // Card animations
  CARD_FLIP_DURATION: 600, // ms
  CARD_HOVER_DURATION: 200, // ms

  // UI feedback
  BUTTON_PRESS_DURATION: 150, // ms
  TOOLTIP_SHOW_DELAY: 500, // ms
  TOOLTIP_HIDE_DELAY: 200, // ms
} as const;

export const SPRING_CONFIG = {
  // React Spring configs
  GENTLE: {
    tension: 120,
    friction: 14,
  },
  NORMAL: {
    tension: 200,
    friction: 40,
  },
  SNAPPY: {
    tension: 300,
    friction: 30,
  },
  STIFF: {
    tension: 400,
    friction: 40,
  },
  BOUNCY: {
    tension: 180,
    friction: 12,
  },
} as const;

export const EASING = {
  // Framer Motion easing functions
  EASE_IN_OUT: [0.42, 0, 0.58, 1],
  EASE_OUT: [0, 0, 0.58, 1],
  EASE_IN: [0.42, 0, 1, 1],
  EASE_OUT_BACK: [0.34, 1.56, 0.64, 1],
  EASE_IN_OUT_BACK: [0.68, -0.55, 0.265, 1.55],
} as const;

export const ANIMATION_DELAYS = {
  // Staggered animation delays
  STAGGER_CHILDREN: 0.1, // seconds
  STAGGER_CARDS: 0.15, // seconds
  STAGGER_SCREENS: 0.05, // seconds

  // Specific delays
  WARP_SCREEN_HIDE: 0, // immediate
  WARP_SCREEN_SHOW: 2000, // ms after warp ends
  PLANET_SURFACE_LOAD: 500, // ms
  HOLOGRAM_APPEAR: 300, // ms
} as const;

export const ANIMATION_THRESHOLDS = {
  // Distance thresholds for stopping animations
  CAMERA_POSITION_THRESHOLD: 0.01,
  CAMERA_TARGET_THRESHOLD: 0.01,
  SCALE_THRESHOLD: 0.001,
  OPACITY_THRESHOLD: 0.01,
} as const;
