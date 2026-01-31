/**
 * ActivaGas Design System - Main Export
 *
 * Central export file for the design system.
 * Import everything you need from this single file.
 *
 * Usage:
 * ```typescript
 * import { colors, typography, spacing, theme } from '@/styles';
 * // or
 * import theme from '@/styles';
 * ```
 */

// Export the main theme as default
export { default } from './theme';

// Export all individual design tokens
export {
  // Scaling functions
  scale,
  verticalScale,
  moderateScale,
  responsive,

  // Color system
  colors,

  // Typography system
  fontFamily,
  fontWeights,
  typography,

  // Spacing system
  spacing,
  verticalSpacing,

  // Border radius
  borderRadius,

  // Shadow/Elevation
  shadows,

  // Component presets
  cardStyles,
  buttonStyles,
  inputStyles,
  containerStyles,

  // Animation presets
  springConfigs,
  timingConfigs,
  easings,

  // Utility functions
  generatePadding,
  generateMargin,
  createCircle,
  createSquare,

  // Other utilities
  hitSlop,
  iconSizes,
} from './theme';

// Export types
export type {
  Theme,
  ColorPalette,
  TypographyScale,
  SpacingScale,
  BorderRadiusScale,
  ShadowScale,
  CardStylePreset,
  ButtonStylePreset,
  InputStylePreset,
  ContainerStylePreset,
  SpringConfigPreset,
  TimingConfigPreset,
  ResponsiveHelpers,
  SpacingKey,
  ShadowKey,
  BorderRadiusKey,
} from './types';

// Export custom hooks
export {
  useDimensions,
  useResponsive,
  useResponsiveValue,
  useOrientation,
  usePlatform,
  useScaling,
  useTheme,
  useSafeSpacing,
  useDynamicStyles,
  useColorUtilities,
  useAnimationState,
} from './hooks';

// Export constants
export {
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
} from './constants';
