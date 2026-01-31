/**
 * ActivaGas Design System
 *
 * Comprehensive theme and styling utilities for the ActivaGas React Native app.
 * This design system provides responsive scaling, typography, spacing, shadows,
 * and component presets while maintaining the existing color scheme and Material Design foundation.
 *
 * Base Design Reference: 375x812 (iPhone X)
 */

import { Dimensions, Platform, TextStyle, ViewStyle } from 'react-native';

// ============================================================================
// DIMENSION UTILITIES
// ============================================================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone X)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scales a value based on screen width
 * Use for horizontal spacing, widths, and font sizes
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scales a value based on screen height
 * Use for vertical spacing and heights
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Moderate scale - less aggressive scaling
 * Use for font sizes and elements that shouldn't scale as dramatically
 * @param size - Base size value
 * @param factor - Scaling factor (0-1), default 0.5
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Responsive helper to get values based on screen width breakpoints
 */
export const responsive = {
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
};

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#1C9ADD',
    secondary: '#1F97DC',
    light: '#4DB5E8',
    dark: '#0F7AB8',
  },

  // Gradients
  gradients: {
    primary: ['#074169', '#019CDE', '#ffffff'],
    login: ['#FFFFFF', '#CCCCCC', '#B3B3B3'],
    dark: ['#323F48', '#074169', '#019CDE'],
    darkAlt: ['#191514', '#074169', '#019CDE'],
  },

  // Neutral Colors
  neutral: {
    black: '#000000',
    darkest: '#191514',
    darker: '#323F48',
    dark: '#4A5A66',
    medium: '#6B7C87',
    light: '#9BADB8',
    lighter: '#D1DAE0',
    lightest: '#E8ECEF',
    white: '#FFFFFF',
  },

  // Semantic Colors
  semantic: {
    success: '#4CAF50',
    successLight: '#81C784',
    successDark: '#388E3C',

    warning: '#FF9800',
    warningLight: '#FFB74D',
    warningDark: '#F57C00',

    error: '#F44336',
    errorLight: '#E57373',
    errorDark: '#D32F2F',

    info: '#2196F3',
    infoLight: '#64B5F6',
    infoDark: '#1976D2',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F7FA',
    tertiary: '#E8ECEF',
    dark: '#191514',
    darker: '#000000',
  },

  // Text Colors
  text: {
    primary: '#191514',
    secondary: '#4A5A66',
    tertiary: '#6B7C87',
    disabled: '#9BADB8',
    inverse: '#FFFFFF',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    medium: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.7)',
  },

  // Border Colors
  border: {
    light: '#E8ECEF',
    medium: '#D1DAE0',
    dark: '#9BADB8',
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'System',
  }),
};

export const fontWeights = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typography = {
  // Display Headings
  h1: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(40),
    fontFamily: fontFamily.bold,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: moderateScale(28),
    lineHeight: moderateScale(36),
    fontFamily: fontFamily.bold,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    fontFamily: fontFamily.bold,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
  } as TextStyle,

  h4: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
    fontFamily: fontFamily.bold,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.15,
  } as TextStyle,

  h5: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.15,
  } as TextStyle,

  h6: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.15,
  } as TextStyle,

  // Body Text
  body1: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.5,
  } as TextStyle,

  body2: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.25,
  } as TextStyle,

  // Supporting Text
  caption: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.4,
  } as TextStyle,

  overline: {
    fontSize: moderateScale(10),
    lineHeight: moderateScale(16),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  } as TextStyle,

  // Button Text
  button: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  } as TextStyle,

  buttonLarge: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  } as TextStyle,
};

// ============================================================================
// SPACING SYSTEM
// ============================================================================

const BASE_UNIT = 4;

export const spacing = {
  xxs: scale(BASE_UNIT * 0.5), // 2px
  xs: scale(BASE_UNIT), // 4px
  sm: scale(BASE_UNIT * 2), // 8px
  md: scale(BASE_UNIT * 4), // 16px
  lg: scale(BASE_UNIT * 6), // 24px
  xl: scale(BASE_UNIT * 8), // 32px
  xxl: scale(BASE_UNIT * 12), // 48px
  xxxl: scale(BASE_UNIT * 16), // 64px
};

export const verticalSpacing = {
  xxs: verticalScale(BASE_UNIT * 0.5),
  xs: verticalScale(BASE_UNIT),
  sm: verticalScale(BASE_UNIT * 2),
  md: verticalScale(BASE_UNIT * 4),
  lg: verticalScale(BASE_UNIT * 6),
  xl: verticalScale(BASE_UNIT * 8),
  xxl: verticalScale(BASE_UNIT * 12),
  xxxl: verticalScale(BASE_UNIT * 16),
};

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const borderRadius = {
  none: 0,
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(32),
  full: 9999,
};

// ============================================================================
// SHADOW / ELEVATION SYSTEM
// ============================================================================

/**
 * Cross-platform shadow system
 * iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android uses elevation
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  xs: Platform.select({
    ios: {
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }) as ViewStyle,

  sm: Platform.select({
    ios: {
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3.0,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,

  md: Platform.select({
    ios: {
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.23,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }) as ViewStyle,

  lg: Platform.select({
    ios: {
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.27,
      shadowRadius: 6.27,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ViewStyle,

  xl: Platform.select({
    ios: {
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 10.32,
    },
    android: {
      elevation: 12,
    },
    default: {},
  }) as ViewStyle,

  xxl: Platform.select({
    ios: {
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 14.0,
    },
    android: {
      elevation: 16,
    },
    default: {},
  }) as ViewStyle,
};

// ============================================================================
// COMPONENT STYLE PRESETS
// ============================================================================

/**
 * Card Style Presets
 */
export const cardStyles = {
  elevated: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    ...shadows.md,
    padding: spacing.md,
  } as ViewStyle,

  elevatedLarge: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
    padding: spacing.lg,
  } as ViewStyle,

  outlined: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.md,
  } as ViewStyle,

  filled: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  } as ViewStyle,

  flat: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  } as ViewStyle,
};

/**
 * Button Style Presets
 */
export const buttonStyles = {
  primary: {
    container: {
      backgroundColor: colors.primary.main,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(48),
    } as ViewStyle,
    text: {
      ...typography.button,
      color: colors.text.inverse,
    } as TextStyle,
  },

  secondary: {
    container: {
      backgroundColor: colors.neutral.lighter,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(48),
    } as ViewStyle,
    text: {
      ...typography.button,
      color: colors.primary.main,
    } as TextStyle,
  },

  outlined: {
    container: {
      backgroundColor: 'transparent',
      borderRadius: borderRadius.sm,
      borderWidth: 1.5,
      borderColor: colors.primary.main,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(48),
    } as ViewStyle,
    text: {
      ...typography.button,
      color: colors.primary.main,
    } as TextStyle,
  },

  text: {
    container: {
      backgroundColor: 'transparent',
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(40),
    } as ViewStyle,
    text: {
      ...typography.button,
      color: colors.primary.main,
    } as TextStyle,
  },

  danger: {
    container: {
      backgroundColor: colors.semantic.error,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(48),
    } as ViewStyle,
    text: {
      ...typography.button,
      color: colors.text.inverse,
    } as TextStyle,
  },

  success: {
    container: {
      backgroundColor: colors.semantic.success,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(48),
    } as ViewStyle,
    text: {
      ...typography.button,
      color: colors.text.inverse,
    } as TextStyle,
  },
};

/**
 * Input/TextField Style Presets
 */
export const inputStyles = {
  outlined: {
    container: {
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border.medium,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: scale(48),
      backgroundColor: colors.background.primary,
    } as ViewStyle,
    input: {
      ...typography.body1,
      color: colors.text.primary,
      padding: 0,
      margin: 0,
    } as TextStyle,
    label: {
      ...typography.body2,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    } as TextStyle,
    error: {
      ...typography.caption,
      color: colors.semantic.error,
      marginTop: spacing.xs,
    } as TextStyle,
  },

  filled: {
    container: {
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: scale(48),
      backgroundColor: colors.background.secondary,
      borderBottomWidth: 2,
      borderBottomColor: colors.border.medium,
    } as ViewStyle,
    input: {
      ...typography.body1,
      color: colors.text.primary,
      padding: 0,
      margin: 0,
    } as TextStyle,
    label: {
      ...typography.body2,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    } as TextStyle,
    error: {
      ...typography.caption,
      color: colors.semantic.error,
      marginTop: spacing.xs,
    } as TextStyle,
  },
};

/**
 * Container Layout Presets
 */
export const containerStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  } as ViewStyle,

  screenWithPadding: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  } as ViewStyle,

  screenCentered: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  } as ViewStyle,

  section: {
    marginBottom: spacing.lg,
  } as ViewStyle,

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  column: {
    flexDirection: 'column',
  } as ViewStyle,

  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
};

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Spring animation configurations
 */
export const springConfigs = {
  default: {
    damping: 15,
    mass: 1,
    stiffness: 120,
  },

  gentle: {
    damping: 20,
    mass: 1,
    stiffness: 100,
  },

  wobbly: {
    damping: 10,
    mass: 1,
    stiffness: 180,
  },

  stiff: {
    damping: 20,
    mass: 1,
    stiffness: 300,
  },

  slow: {
    damping: 20,
    mass: 1,
    stiffness: 80,
  },
};

/**
 * Timing animation configurations
 */
export const timingConfigs = {
  fast: {
    duration: 200,
    useNativeDriver: true,
  },

  normal: {
    duration: 300,
    useNativeDriver: true,
  },

  slow: {
    duration: 500,
    useNativeDriver: true,
  },

  verySlow: {
    duration: 800,
    useNativeDriver: true,
  },
};

/**
 * Easing functions for animations
 */
export const easings = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates consistent padding for components
 */
export const generatePadding = (
  vertical: keyof typeof spacing,
  horizontal: keyof typeof spacing,
): ViewStyle => ({
  paddingVertical: spacing[vertical],
  paddingHorizontal: spacing[horizontal],
});

/**
 * Generates consistent margin for components
 */
export const generateMargin = (
  vertical: keyof typeof spacing,
  horizontal: keyof typeof spacing,
): ViewStyle => ({
  marginVertical: spacing[vertical],
  marginHorizontal: spacing[horizontal],
});

/**
 * Creates a circle with the given size
 */
export const createCircle = (size: number): ViewStyle => ({
  width: scale(size),
  height: scale(size),
  borderRadius: scale(size / 2),
});

/**
 * Creates a square with the given size
 */
export const createSquare = (size: number): ViewStyle => ({
  width: scale(size),
  height: scale(size),
});

/**
 * Generates hit slop for touchable elements (improves touch target size)
 */
export const hitSlop = {
  sm: { top: 8, bottom: 8, left: 8, right: 8 },
  md: { top: 12, bottom: 12, left: 12, right: 12 },
  lg: { top: 16, bottom: 16, left: 16, right: 16 },
};

/**
 * Common icon sizes
 */
export const iconSizes = {
  xs: scale(12),
  sm: scale(16),
  md: scale(24),
  lg: scale(32),
  xl: scale(48),
  xxl: scale(64),
};

// ============================================================================
// EXPORT DEFAULT THEME
// ============================================================================

const theme = {
  colors,
  typography,
  spacing,
  verticalSpacing,
  borderRadius,
  shadows,
  cardStyles,
  buttonStyles,
  inputStyles,
  containerStyles,
  springConfigs,
  timingConfigs,
  easings,
  scale,
  verticalScale,
  moderateScale,
  responsive,
  generatePadding,
  generateMargin,
  createCircle,
  createSquare,
  hitSlop,
  iconSizes,
};

export default theme;
