/**
 * ActivaGas Design System - Constants
 *
 * Common constants used throughout the application.
 * These values ensure consistency in layout dimensions, touch targets,
 * and other fixed measurements.
 */

import { Platform } from 'react-native';
import { scale, verticalScale } from './theme';

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

/**
 * Common layout dimensions
 */
export const LAYOUT = {
  // Screen padding
  SCREEN_HORIZONTAL_PADDING: scale(16),
  SCREEN_VERTICAL_PADDING: verticalScale(24),

  // Container widths
  MAX_CONTENT_WIDTH: scale(600), // Maximum width for content on tablets
  MIN_TOUCHABLE_SIZE: scale(44), // Minimum touch target size (accessibility)

  // Safe area approximations (if not using safe-area-context)
  STATUS_BAR_HEIGHT: Platform.select({
    ios: verticalScale(44),
    android: verticalScale(24),
    default: 0,
  }),

  // Navigation
  TAB_BAR_HEIGHT: verticalScale(56),
  HEADER_HEIGHT: verticalScale(56),

  // Common component sizes
  BUTTON_HEIGHT: scale(48),
  INPUT_HEIGHT: scale(48),
  SMALL_BUTTON_HEIGHT: scale(36),
  LARGE_BUTTON_HEIGHT: scale(56),
};

// ============================================================================
// Z-INDEX CONSTANTS
// ============================================================================

/**
 * Z-index values for layering
 * Use these to ensure consistent stacking order
 */
export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1100,
  FIXED: 1200,
  MODAL_BACKDROP: 1300,
  MODAL: 1400,
  POPOVER: 1500,
  TOOLTIP: 1600,
  NOTIFICATION: 1700,
  LOADING_OVERLAY: 1800,
  DEBUG: 9999,
};

// ============================================================================
// ANIMATION CONSTANTS
// ============================================================================

/**
 * Animation timing constants
 */
export const ANIMATION = {
  // Duration in milliseconds
  DURATION_INSTANT: 0,
  DURATION_FAST: 200,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
  DURATION_VERY_SLOW: 800,

  // Common animation values
  FADE_OPACITY: {
    HIDDEN: 0,
    VISIBLE: 1,
    DIM: 0.5,
  },

  // Scale values
  SCALE: {
    PRESSED: 0.95,
    NORMAL: 1,
    ENLARGED: 1.05,
  },

  // Rotation degrees
  ROTATION: {
    QUARTER: 90,
    HALF: 180,
    THREE_QUARTERS: 270,
    FULL: 360,
  },
};

// ============================================================================
// INPUT CONSTANTS
// ============================================================================

/**
 * Input field constants
 */
export const INPUT = {
  // Max lengths
  MAX_LENGTH_SHORT: 50,
  MAX_LENGTH_MEDIUM: 100,
  MAX_LENGTH_LONG: 500,
  MAX_LENGTH_VERY_LONG: 2000,

  // Debounce delays (ms)
  DEBOUNCE_SHORT: 150,
  DEBOUNCE_MEDIUM: 300,
  DEBOUNCE_LONG: 500,

  // Auto-complete delays (ms)
  AUTOCOMPLETE_DELAY: 300,
};

// ============================================================================
// GRID & LAYOUT CONSTANTS
// ============================================================================

/**
 * Grid system constants
 */
export const GRID = {
  // Column counts for different screen sizes
  COLUMNS_MOBILE: 4,
  COLUMNS_TABLET: 8,
  COLUMNS_DESKTOP: 12,

  // Gutter sizes (gap between grid items)
  GUTTER_SMALL: scale(8),
  GUTTER_MEDIUM: scale(16),
  GUTTER_LARGE: scale(24),
};

// ============================================================================
// ASPECT RATIOS
// ============================================================================

/**
 * Common aspect ratios for images and media
 */
export const ASPECT_RATIO = {
  SQUARE: 1,
  LANDSCAPE: 16 / 9,
  PORTRAIT: 9 / 16,
  WIDE: 21 / 9,
  CARD: 3 / 4,
  GOLDEN: 1.618,
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Screen size breakpoints (width in pixels)
 * Use these for responsive design decisions
 */
export const BREAKPOINTS = {
  SMALL: 375,   // iPhone SE, small phones
  MEDIUM: 414,  // iPhone 11 Pro Max, standard phones
  LARGE: 768,   // iPad Mini, small tablets
  XLARGE: 1024, // iPad, tablets
  XXLARGE: 1440, // Large tablets, desktop
};

// ============================================================================
// BORDER WIDTH CONSTANTS
// ============================================================================

/**
 * Common border widths
 */
export const BORDER_WIDTH = {
  HAIRLINE: Platform.select({
    ios: 0.5,
    android: 1,
    default: 1,
  }),
  THIN: 1,
  MEDIUM: 2,
  THICK: 3,
  VERY_THICK: 4,
};

// ============================================================================
// OPACITY CONSTANTS
// ============================================================================

/**
 * Common opacity values
 */
export const OPACITY = {
  TRANSPARENT: 0,
  BARELY_VISIBLE: 0.1,
  LIGHT: 0.3,
  MEDIUM: 0.5,
  STRONG: 0.7,
  VERY_STRONG: 0.9,
  OPAQUE: 1,
};

// ============================================================================
// IMAGE SIZES
// ============================================================================

/**
 * Standard image dimensions
 */
export const IMAGE_SIZE = {
  THUMBNAIL: scale(48),
  SMALL: scale(64),
  MEDIUM: scale(120),
  LARGE: scale(200),
  XLARGE: scale(320),
  AVATAR_SMALL: scale(32),
  AVATAR_MEDIUM: scale(48),
  AVATAR_LARGE: scale(80),
  AVATAR_XLARGE: scale(120),
};

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Loading indicator sizes
 */
export const LOADING_SIZE = {
  SMALL: 'small' as const,
  LARGE: 'large' as const,
};

// ============================================================================
// FONT SIZES (Backup if not using typography presets)
// ============================================================================

/**
 * Font size constants
 * Note: Prefer using typography presets from theme.ts
 */
export const FONT_SIZE = {
  XXS: scale(10),
  XS: scale(12),
  SM: scale(14),
  MD: scale(16),
  LG: scale(18),
  XL: scale(20),
  XXL: scale(24),
  XXXL: scale(32),
};

// ============================================================================
// LINE HEIGHT MULTIPLIERS
// ============================================================================

/**
 * Line height multipliers for text
 */
export const LINE_HEIGHT_MULTIPLIER = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  LOOSE: 1.8,
};

// ============================================================================
// GESTURE CONSTANTS
// ============================================================================

/**
 * Touch and gesture constants
 */
export const GESTURE = {
  // Minimum swipe distance
  MIN_SWIPE_DISTANCE: scale(50),

  // Swipe velocity threshold
  SWIPE_VELOCITY_THRESHOLD: 0.5,

  // Long press duration (ms)
  LONG_PRESS_DURATION: 500,

  // Double tap max delay (ms)
  DOUBLE_TAP_DELAY: 300,
};

// ============================================================================
// TOAST/NOTIFICATION CONSTANTS
// ============================================================================

/**
 * Toast and notification display durations
 */
export const NOTIFICATION = {
  DURATION_SHORT: 2000,
  DURATION_MEDIUM: 4000,
  DURATION_LONG: 6000,
  DURATION_PERSISTENT: -1, // Never auto-dismiss
};

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

/**
 * Pagination and list constants
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  SMALL_PAGE_SIZE: 10,
  LARGE_PAGE_SIZE: 50,

  // Scroll threshold for infinite scroll
  SCROLL_THRESHOLD: 0.8, // Load more at 80% scroll
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Common validation patterns and limits
 */
export const VALIDATION = {
  // Email regex (basic validation)
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone regex (basic validation, adjust for locale)
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,

  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,

  // Name fields
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// ============================================================================
// CACHE CONSTANTS
// ============================================================================

/**
 * Cache duration constants (in milliseconds)
 */
export const CACHE = {
  DURATION_SHORT: 5 * 60 * 1000,      // 5 minutes
  DURATION_MEDIUM: 30 * 60 * 1000,    // 30 minutes
  DURATION_LONG: 60 * 60 * 1000,      // 1 hour
  DURATION_VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  LAYOUT,
  Z_INDEX,
  ANIMATION,
  INPUT,
  GRID,
  ASPECT_RATIO,
  BREAKPOINTS,
  BORDER_WIDTH,
  OPACITY,
  IMAGE_SIZE,
  LOADING_SIZE,
  FONT_SIZE,
  LINE_HEIGHT_MULTIPLIER,
  GESTURE,
  NOTIFICATION,
  PAGINATION,
  VALIDATION,
  CACHE,
};
