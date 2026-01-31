/**
 * ActivaGas Design System - React Hooks
 *
 * Custom hooks for using the design system in functional components.
 * These hooks provide responsive updates, theme access, and utility functions.
 */

import { useEffect, useState } from 'react';
import { Dimensions as RNDimensions, ScaledSize, Platform } from 'react-native';
import {
  colors,
  spacing,
  typography,
  shadows,
  scale,
  verticalScale,
  moderateScale,
  responsive,
} from './theme';

// ============================================================================
// DIMENSIONS HOOK
// ============================================================================

interface DimensionsState {
  window: ScaledSize;
  screen: ScaledSize;
}

/**
 * Hook to get current window and screen dimensions
 * Updates on dimension changes (e.g., rotation)
 *
 * @returns Current window and screen dimensions
 *
 * @example
 * ```typescript
 * const { window, screen } = useDimensions();
 * console.log('Width:', window.width);
 * ```
 */
export const useDimensions = (): DimensionsState => {
  const [dimensions, setDimensions] = useState<DimensionsState>({
    window: RNDimensions.get('window'),
    screen: RNDimensions.get('screen'),
  });

  useEffect(() => {
    const subscription = RNDimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// ============================================================================
// RESPONSIVE VALUES HOOK
// ============================================================================

interface ResponsiveBreakpoints {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

/**
 * Hook to get responsive breakpoint information
 * Updates on dimension changes
 *
 * @returns Responsive breakpoint booleans
 *
 * @example
 * ```typescript
 * const { isTablet, isLandscape } = useResponsive();
 * if (isTablet) {
 *   // Render tablet layout
 * }
 * ```
 */
export const useResponsive = (): ResponsiveBreakpoints => {
  const { window } = useDimensions();

  return {
    isSmallDevice: window.width < 375,
    isMediumDevice: window.width >= 375 && window.width < 414,
    isLargeDevice: window.width >= 414 && window.width < 768,
    isTablet: window.width >= 768,
    isLandscape: window.width > window.height,
    isPortrait: window.height >= window.width,
  };
};

// ============================================================================
// RESPONSIVE VALUE HOOK
// ============================================================================

interface ResponsiveValueOptions<T> {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}

/**
 * Hook to get a responsive value based on screen size
 *
 * @param options - Object with values for different breakpoints
 * @returns Value for current screen size
 *
 * @example
 * ```typescript
 * const padding = useResponsiveValue({
 *   small: spacing.sm,
 *   medium: spacing.md,
 *   tablet: spacing.xl,
 *   default: spacing.lg,
 * });
 * ```
 */
export const useResponsiveValue = <T>(options: ResponsiveValueOptions<T>): T => {
  const breakpoints = useResponsive();

  if (breakpoints.isTablet && options.tablet !== undefined) {
    return options.tablet;
  }
  if (breakpoints.isLargeDevice && options.large !== undefined) {
    return options.large;
  }
  if (breakpoints.isMediumDevice && options.medium !== undefined) {
    return options.medium;
  }
  if (breakpoints.isSmallDevice && options.small !== undefined) {
    return options.small;
  }

  return options.default;
};

// ============================================================================
// ORIENTATION HOOK
// ============================================================================

type Orientation = 'portrait' | 'landscape';

/**
 * Hook to get current device orientation
 * Updates on orientation changes
 *
 * @returns Current orientation ('portrait' or 'landscape')
 *
 * @example
 * ```typescript
 * const orientation = useOrientation();
 * if (orientation === 'landscape') {
 *   // Render landscape layout
 * }
 * ```
 */
export const useOrientation = (): Orientation => {
  const { window } = useDimensions();
  return window.width > window.height ? 'landscape' : 'portrait';
};

// ============================================================================
// PLATFORM CHECKS HOOK
// ============================================================================

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  OS: typeof Platform.OS;
  version: string | number;
}

/**
 * Hook to get platform information
 *
 * @returns Platform information object
 *
 * @example
 * ```typescript
 * const { isIOS, isAndroid } = usePlatform();
 * if (isIOS) {
 *   // iOS-specific logic
 * }
 * ```
 */
export const usePlatform = (): PlatformInfo => {
  return {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
    OS: Platform.OS,
    version: Platform.Version,
  };
};

// ============================================================================
// SCALING HOOK
// ============================================================================

interface ScalingFunctions {
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
}

/**
 * Hook to access scaling functions
 * Useful when you need to compute scaled values dynamically
 *
 * @returns Object with scaling functions
 *
 * @example
 * ```typescript
 * const { scale, moderateScale } = useScaling();
 * const buttonWidth = scale(100);
 * const fontSize = moderateScale(16);
 * ```
 */
export const useScaling = (): ScalingFunctions => {
  return {
    scale,
    verticalScale,
    moderateScale,
  };
};

// ============================================================================
// THEME ACCESSOR HOOK
// ============================================================================

interface ThemeAccessor {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
}

/**
 * Hook to access all theme tokens
 * Provides easy access to the entire design system
 *
 * @returns Object with all theme tokens
 *
 * @example
 * ```typescript
 * const { colors, spacing, typography } = useTheme();
 * const style = {
 *   color: colors.primary.main,
 *   padding: spacing.md,
 *   ...typography.h3,
 * };
 * ```
 */
export const useTheme = (): ThemeAccessor => {
  return {
    colors,
    spacing,
    typography,
    shadows,
  };
};

// ============================================================================
// SAFE AREA HOOK (Optional - requires react-native-safe-area-context)
// ============================================================================

/**
 * Hook to get responsive spacing that accounts for safe areas
 *
 * @param baseSpacing - Base spacing value
 * @returns Responsive spacing with safe area consideration
 *
 * @example
 * ```typescript
 * const paddingTop = useSafeSpacing(spacing.lg);
 * ```
 *
 * Note: This requires react-native-safe-area-context to be installed
 * If not installed, returns the base spacing value
 */
export const useSafeSpacing = (baseSpacing: number): number => {
  // This is a placeholder implementation
  // In a real app, you would use useSafeAreaInsets from react-native-safe-area-context
  // import { useSafeAreaInsets } from 'react-native-safe-area-context';
  // const insets = useSafeAreaInsets();
  // return baseSpacing + insets.top;

  return baseSpacing;
};

// ============================================================================
// DYNAMIC STYLES HOOK
// ============================================================================

/**
 * Hook to create dynamic styles that update with responsive changes
 *
 * @param styleFactory - Function that returns styles based on current responsive state
 * @returns Computed styles
 *
 * @example
 * ```typescript
 * const styles = useDynamicStyles((responsive) => ({
 *   container: {
 *     padding: responsive.isTablet ? spacing.xl : spacing.md,
 *   },
 * }));
 * ```
 */
export const useDynamicStyles = <T>(
  styleFactory: (responsive: ResponsiveBreakpoints) => T,
): T => {
  const responsiveState = useResponsive();
  const [styles, setStyles] = useState<T>(() => styleFactory(responsiveState));

  useEffect(() => {
    setStyles(styleFactory(responsiveState));
  }, [
    responsiveState.isSmallDevice,
    responsiveState.isMediumDevice,
    responsiveState.isLargeDevice,
    responsiveState.isTablet,
    responsiveState.isLandscape,
  ]);

  return styles;
};

// ============================================================================
// COLOR UTILITIES HOOK
// ============================================================================

interface ColorUtilities {
  getContrastText: (backgroundColor: string) => string;
  getSemanticColor: (type: 'success' | 'warning' | 'error' | 'info') => string;
  getStatusColor: (
    status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed',
  ) => string;
}

/**
 * Hook to access color utility functions
 *
 * @returns Object with color utility functions
 *
 * @example
 * ```typescript
 * const { getContrastText, getSemanticColor } = useColorUtilities();
 * const textColor = getContrastText(backgroundColor);
 * const successColor = getSemanticColor('success');
 * ```
 */
export const useColorUtilities = (): ColorUtilities => {
  const getContrastText = (backgroundColor: string): string => {
    // Simple implementation - in production, use a proper contrast ratio calculator
    const darkBackgrounds = [
      colors.neutral.black,
      colors.neutral.darkest,
      colors.neutral.darker,
      colors.primary.dark,
    ];

    return darkBackgrounds.includes(backgroundColor)
      ? colors.text.inverse
      : colors.text.primary;
  };

  const getSemanticColor = (
    type: 'success' | 'warning' | 'error' | 'info',
  ): string => {
    return colors.semantic[type];
  };

  const getStatusColor = (
    status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed',
  ): string => {
    const statusColorMap = {
      active: colors.semantic.success,
      inactive: colors.neutral.medium,
      pending: colors.semantic.warning,
      completed: colors.semantic.success,
      failed: colors.semantic.error,
    };

    return statusColorMap[status];
  };

  return {
    getContrastText,
    getSemanticColor,
    getStatusColor,
  };
};

// ============================================================================
// ANIMATION STATE HOOK
// ============================================================================

/**
 * Hook to manage animation state with design system timing
 *
 * @param duration - Animation duration (uses timing configs if string)
 * @returns Animation state and controls
 *
 * @example
 * ```typescript
 * const { isAnimating, start, stop } = useAnimationState('normal');
 * start(); // Starts animation with normal timing (300ms)
 * ```
 */
export const useAnimationState = (
  duration: 'fast' | 'normal' | 'slow' | 'verySlow' | number = 'normal',
) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const durationMap = {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  };

  const actualDuration =
    typeof duration === 'string' ? durationMap[duration] : duration;

  const start = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, actualDuration);
  };

  const stop = () => {
    setIsAnimating(false);
  };

  return {
    isAnimating,
    start,
    stop,
    duration: actualDuration,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
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
};
