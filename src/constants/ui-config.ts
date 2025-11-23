/**
 * UI Layout and Positioning Configuration
 * Centralized constants for UI component positioning and sizing
 */

export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

export const MODAL_CONFIG = {
  // Project detail modal
  MAX_WIDTH: "800px",
  MAX_HEIGHT_MOBILE: "95vh",
  MAX_HEIGHT_TABLET: "90vh",
  MAX_HEIGHT_DESKTOP: "700px",

  // Padding
  PADDING_MOBILE: "1rem",
  PADDING_TABLET: "1.5rem",
  PADDING_DESKTOP: "2rem",

  // Close button
  CLOSE_BUTTON_SIZE_MOBILE: "2.5rem",
  CLOSE_BUTTON_SIZE_DESKTOP: "3rem",
} as const;

export const MISSION_PREVIEW_CONFIG = {
  // Positioning
  TOP_OFFSET_MOBILE: "5rem",
  TOP_OFFSET_DESKTOP: "6rem",
  RIGHT_OFFSET_MOBILE: "0.75rem",
  RIGHT_OFFSET_DESKTOP: "1.5rem",

  // Sizing
  WIDTH_MOBILE: "calc(100vw - 1.5rem)",
  WIDTH_DESKTOP: "20rem",
  MAX_WIDTH: "28rem",

  // Animation
  INITIAL_SCALE: 0.9,
  ANIMATE_SCALE: 1,
  EXIT_SCALE: 0.95,
} as const;

export const HOLOGRAM_SCREEN_POSITIONS = {
  // 3x3 grid spacing multipliers (applied to spacing constant)
  POSITIONS: [
    // Top row
    { x: -7, y: 4, z: -5 },
    { x: 0, y: 5, z: -9 },
    { x: 7, y: 4, z: -6 },
    // Middle row
    { x: -6, y: 0, z: -10 },
    { x: 0, y: 0, z: -4 },
    { x: 6, y: 0, z: -8 },
    // Bottom row
    { x: -7, y: -4, z: -7 },
    { x: 0, y: -5, z: -10 },
    { x: 7, y: -4, z: -5 },
  ],
} as const;

export const GUIDE_MESSAGE_CONFIG = {
  // Positioning
  TOP_MOBILE: "0.75rem",
  TOP_DESKTOP: "1.5rem",

  // Text sizing
  TEXT_SIZE_MOBILE: "0.75rem",
  TEXT_SIZE_TABLET: "0.875rem",
  TEXT_SIZE_DESKTOP: "1.125rem",

  // Padding
  PADDING_X_MOBILE: "0.75rem",
  PADDING_X_TABLET: "1rem",
  PADDING_X_DESKTOP: "1.5rem",
  PADDING_Y_MOBILE: "0.375rem",
  PADDING_Y_TABLET: "0.5rem",
  PADDING_Y_DESKTOP: "0.75rem",
} as const;

export const LANGUAGE_TOGGLE_CONFIG = {
  // Positioning
  TOP_MOBILE: "0.75rem",
  TOP_DESKTOP: "1.5rem",
  RIGHT_MOBILE: "0.75rem",
  RIGHT_DESKTOP: "1.5rem",

  // Button sizing
  PADDING_X_MOBILE: "0.75rem",
  PADDING_X_DESKTOP: "1rem",
  PADDING_Y_MOBILE: "0.375rem",
  PADDING_Y_DESKTOP: "0.5rem",

  // Text sizing
  TEXT_SIZE_MOBILE: "0.75rem",
  TEXT_SIZE_DESKTOP: "0.875rem",
} as const;

export const CARD_DETAIL_CONFIG = {
  // Spacing
  CONTENT_SPACING_MOBILE: "1.5rem",
  CONTENT_SPACING_TABLET: "2rem",
  CONTENT_SPACING_DESKTOP: "3rem",

  // Header spacing
  HEADER_SPACING_MOBILE: "1rem",
  HEADER_SPACING_TABLET: "1.5rem",
  HEADER_SPACING_DESKTOP: "2rem",

  // Typography
  TITLE_SIZE_MOBILE: "1.5rem",
  TITLE_SIZE_TABLET: "1.875rem",
  TITLE_SIZE_DESKTOP: "2.25rem",

  DESCRIPTION_SIZE_MOBILE: "1rem",
  DESCRIPTION_SIZE_TABLET: "1.125rem",
  DESCRIPTION_SIZE_DESKTOP: "1.25rem",

  BODY_SIZE_MOBILE: "0.875rem",
  BODY_SIZE_TABLET: "1rem",
  BODY_SIZE_DESKTOP: "1.125rem",

  // Image
  IMAGE_HEIGHT_MOBILE: "16rem",
  IMAGE_HEIGHT_DESKTOP: "20rem",

  // Tech badges
  TECH_GAP_MOBILE: "0.5rem",
  TECH_GAP_DESKTOP: "0.75rem",
  TECH_PADDING_X_MOBILE: "0.75rem",
  TECH_PADDING_X_TABLET: "1rem",
  TECH_PADDING_X_DESKTOP: "1.25rem",
} as const;

export const Z_INDEX = {
  LANGUAGE_TOGGLE: 50,
  GUIDE_MESSAGE: 30,
  MISSION_PREVIEW: 30,
  MODAL_OVERLAY: 40,
  MODAL_CONTENT: 40,
  CLOSE_BUTTON: 10,
} as const;
