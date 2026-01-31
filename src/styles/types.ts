/**
 * ActivaGas Design System - Type Definitions
 *
 * Comprehensive type definitions for the design system to ensure type safety
 * and better IDE autocomplete support.
 */

import { TextStyle, ViewStyle } from 'react-native';

// ============================================================================
// SPACING TYPES
// ============================================================================

export type SpacingKey = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export interface SpacingScale {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

// ============================================================================
// COLOR TYPES
// ============================================================================

export interface PrimaryColors {
  main: string;
  secondary: string;
  light: string;
  dark: string;
}

export interface GradientColors {
  primary: string[];
  login: string[];
  dark: string[];
  darkAlt: string[];
}

export interface NeutralColors {
  black: string;
  darkest: string;
  darker: string;
  dark: string;
  medium: string;
  light: string;
  lighter: string;
  lightest: string;
  white: string;
}

export interface SemanticColorSet {
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
  dark: string;
  darker: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
  inverse: string;
}

export interface OverlayColors {
  light: string;
  medium: string;
  dark: string;
  darker: string;
}

export interface BorderColors {
  light: string;
  medium: string;
  dark: string;
}

export interface ColorPalette {
  primary: PrimaryColors;
  gradients: GradientColors;
  neutral: NeutralColors;
  semantic: SemanticColorSet;
  background: BackgroundColors;
  text: TextColors;
  overlay: OverlayColors;
  border: BorderColors;
}

// ============================================================================
// TYPOGRAPHY TYPES
// ============================================================================

export interface FontFamily {
  regular: string;
  medium: string;
  bold: string;
  light: string;
}

export interface FontWeights {
  light: TextStyle['fontWeight'];
  regular: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semibold: TextStyle['fontWeight'];
  bold: TextStyle['fontWeight'];
}

export interface TypographyScale {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
  button: TextStyle;
  buttonLarge: TextStyle;
}

// ============================================================================
// BORDER RADIUS TYPES
// ============================================================================

export type BorderRadiusKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

export interface BorderRadiusScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
}

// ============================================================================
// SHADOW TYPES
// ============================================================================

export type ShadowKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ShadowScale {
  none: ViewStyle;
  xs: ViewStyle;
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
  xl: ViewStyle;
  xxl: ViewStyle;
}

// ============================================================================
// COMPONENT PRESET TYPES
// ============================================================================

export interface CardStylePreset {
  elevated: ViewStyle;
  elevatedLarge: ViewStyle;
  outlined: ViewStyle;
  filled: ViewStyle;
  flat: ViewStyle;
}

export interface ButtonStyleSet {
  container: ViewStyle;
  text: TextStyle;
}

export interface ButtonStylePreset {
  primary: ButtonStyleSet;
  secondary: ButtonStyleSet;
  outlined: ButtonStyleSet;
  text: ButtonStyleSet;
  danger: ButtonStyleSet;
  success: ButtonStyleSet;
}

export interface InputStyleSet {
  container: ViewStyle;
  input: TextStyle;
  label: TextStyle;
  error: TextStyle;
}

export interface InputStylePreset {
  outlined: InputStyleSet;
  filled: InputStyleSet;
}

export interface ContainerStylePreset {
  screen: ViewStyle;
  screenWithPadding: ViewStyle;
  screenCentered: ViewStyle;
  section: ViewStyle;
  row: ViewStyle;
  rowBetween: ViewStyle;
  rowCenter: ViewStyle;
  column: ViewStyle;
  columnCenter: ViewStyle;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export interface SpringConfig {
  damping: number;
  mass: number;
  stiffness: number;
}

export interface SpringConfigPreset {
  default: SpringConfig;
  gentle: SpringConfig;
  wobbly: SpringConfig;
  stiff: SpringConfig;
  slow: SpringConfig;
}

export interface TimingConfig {
  duration: number;
  useNativeDriver: boolean;
}

export interface TimingConfigPreset {
  fast: TimingConfig;
  normal: TimingConfig;
  slow: TimingConfig;
  verySlow: TimingConfig;
}

export interface EasingPreset {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
}

// ============================================================================
// RESPONSIVE TYPES
// ============================================================================

export interface ResponsiveHelpers {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
}

// ============================================================================
// HIT SLOP TYPES
// ============================================================================

export interface HitSlopInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface HitSlopPreset {
  sm: HitSlopInsets;
  md: HitSlopInsets;
  lg: HitSlopInsets;
}

// ============================================================================
// ICON SIZE TYPES
// ============================================================================

export interface IconSizeScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// ============================================================================
// UTILITY FUNCTION TYPES
// ============================================================================

export type ScaleFunction = (size: number) => number;
export type VerticalScaleFunction = (size: number) => number;
export type ModerateScaleFunction = (size: number, factor?: number) => number;

export type GeneratePaddingFunction = (
  vertical: SpacingKey,
  horizontal: SpacingKey,
) => ViewStyle;

export type GenerateMarginFunction = (
  vertical: SpacingKey,
  horizontal: SpacingKey,
) => ViewStyle;

export type CreateCircleFunction = (size: number) => ViewStyle;
export type CreateSquareFunction = (size: number) => ViewStyle;

// ============================================================================
// MAIN THEME TYPE
// ============================================================================

export interface Theme {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  verticalSpacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  cardStyles: CardStylePreset;
  buttonStyles: ButtonStylePreset;
  inputStyles: InputStylePreset;
  containerStyles: ContainerStylePreset;
  springConfigs: SpringConfigPreset;
  timingConfigs: TimingConfigPreset;
  easings: EasingPreset;
  scale: ScaleFunction;
  verticalScale: VerticalScaleFunction;
  moderateScale: ModerateScaleFunction;
  responsive: ResponsiveHelpers;
  generatePadding: GeneratePaddingFunction;
  generateMargin: GenerateMarginFunction;
  createCircle: CreateCircleFunction;
  createSquare: CreateSquareFunction;
  hitSlop: HitSlopPreset;
  iconSizes: IconSizeScale;
}

// ============================================================================
// STYLE COMPOSITION HELPERS
// ============================================================================

/**
 * Helper type for combining multiple style objects
 */
export type StyleProp<T> = T | T[] | null | undefined;

/**
 * Helper type for conditional styles
 */
export type ConditionalStyle<T> = T | false | null | undefined;

// ============================================================================
// EXPORT TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid spacing key
 */
export const isSpacingKey = (value: string): value is SpacingKey => {
  return ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].includes(value);
};

/**
 * Type guard to check if a value is a valid shadow key
 */
export const isShadowKey = (value: string): value is ShadowKey => {
  return ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(value);
};

/**
 * Type guard to check if a value is a valid border radius key
 */
export const isBorderRadiusKey = (value: string): value is BorderRadiusKey => {
  return ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full'].includes(value);
};
