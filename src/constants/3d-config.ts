/**
 * 3D Scene and Planet Surface Configuration
 * Centralized constants for 3D rendering settings
 */

export const PLANET_SURFACE_CONFIG = {
  // Astronaut spawn and movement
  ASTRONAUT_SPAWN_HEIGHT: 15,
  GROUND_LEVEL: 0,
  MOVEMENT_BOUNDARY_RADIUS: 15,
  MOON_WALK_SPEED: 1.5,
  MOON_WALK_STEP_HEIGHT: 0.08,
  MOON_WALK_STEP_FREQUENCY: 4,

  // Jetpack and jump mechanics
  JETPACK_THRUST: 0.15,
  GRAVITY: 0.008,
  JUMP_VELOCITY: 0.3,
  JUMP_COOLDOWN: 500, // ms
  TERMINAL_VELOCITY: 0.5,

  // Terrain
  TERRAIN_RADIUS: 50,
  TERRAIN_SEGMENTS_LOW: 32,
  TERRAIN_SEGMENTS_MEDIUM: 48,
  TERRAIN_SEGMENTS_HIGH: 64,
  TERRAIN_DISPLACEMENT: 2,
  TERRAIN_NOISE_SCALE: 0.1,

  // Rocks and decorations
  ROCK_COUNT_MOBILE: 20,
  ROCK_COUNT_TABLET: 30,
  ROCK_COUNT_DESKTOP: 40,
  PEBBLE_COUNT_MOBILE: 30,
  PEBBLE_COUNT_TABLET: 65,
  PEBBLE_COUNT_DESKTOP: 100,

  // Camera
  CAMERA_FOV_MOBILE: 75,
  CAMERA_FOV_DESKTOP: 60,
  CAMERA_INITIAL_POSITION: [5, 3, 8] as [number, number, number],

  // Smoke trail
  SMOKE_LIFETIME: 3000, // ms
  SMOKE_MAX_AGE: 3, // seconds
} as const;

export const HOLOGRAM_CONFIG = {
  // Screen dimensions
  SCREEN_WIDTH: 3.2,
  SCREEN_HEIGHT: 2.2,
  SCREEN_DEPTH: 0.05,
  CONTENT_WIDTH: 3,
  CONTENT_HEIGHT: 2,

  // Screen spacing
  SPACING_MOBILE: 0.6,
  SPACING_DESKTOP: 1.0,

  // Glow and effects
  GLOW_OPACITY_SELECTED: 0.4,
  GLOW_OPACITY_HOVERED: 0.3,
  GLOW_OPACITY_DEFAULT: 0.2,
  FLICKER_FREQUENCY: 3,
  FLICKER_AMPLITUDE: 0.05,

  // Floating animation
  FLOAT_FREQUENCY: 0.5,
  FLOAT_AMPLITUDE: 0.05,

  // Mouse tilt effect
  MAX_TILT_RADIANS: 0.15, // ~8.6 degrees
  TILT_LERP_SPEED: 0.05,

  // Particle ring (selected state)
  PARTICLE_COUNT: 60,
  PARTICLE_RING_RADIUS_MIN: 1.8,
  PARTICLE_RING_RADIUS_VARIANCE: 0.3,
  PARTICLE_SIZE: 0.03,
} as const;

export const CAMERA_CONFIG = {
  // Initial position
  INITIAL_Z_MOBILE: 12,
  INITIAL_Z_DESKTOP: 10,
  INITIAL_LOOK_AT: [0, 0, -6] as [number, number, number],

  // Animation
  LERP_SPEED: 0.1,
  ANIMATION_THRESHOLD: 0.01,

  // Zoom distances
  ZOOM_DISTANCE_MOBILE: 8,
  ZOOM_DISTANCE_DESKTOP: 10,

  // OrbitControls
  MIN_DISTANCE_MOBILE: 4,
  MIN_DISTANCE_DESKTOP: 5,
  MAX_DISTANCE_MOBILE: 30,
  MAX_DISTANCE_DESKTOP: 25,
  ZOOM_SPEED_MOBILE: 0.8,
  ZOOM_SPEED_DESKTOP: 0.6,
  ROTATE_SPEED_MOBILE: 0.7,
  ROTATE_SPEED_DESKTOP: 0.5,
  DAMPING_FACTOR: 0.05,
} as const;

export const WARP_CONFIG = {
  // Warp animation
  WARP_DURATION: 3000, // ms
  WARP_STAR_STRETCH: 5,
  WARP_SPEED_MULTIPLIER: 10,

  // TV effect timing
  TV_TURNOFF_DURATION: 1000, // ms
  TV_TURNON_DURATION: 100, // ms
  TV_TURNON_DELAY: 100, // ms

  // Screen visibility timing
  SCREEN_HIDE_DELAY: 0, // immediate
  SCREEN_SHOW_DELAY: 2000, // ms after warp ends
} as const;
