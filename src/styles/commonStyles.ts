/**
 * Common Styles - Centralized StyleSheet
 *
 * Replace inline styles with these reusable styles to:
 * - Improve performance (StyleSheet creates optimized style objects)
 * - Ensure consistency across components
 * - Reduce code duplication
 *
 * Usage:
 * import { commonStyles } from '@/styles/commonStyles';
 * <View style={commonStyles.centeredContainer}>
 */
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const commonStyles = StyleSheet.create({
  // ============================================
  // Layout - Flex Containers
  // ============================================
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },

  // ============================================
  // Centered Containers (most common pattern)
  // ============================================
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ============================================
  // Flex Direction
  // ============================================
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },

  // ============================================
  // Justify Content
  // ============================================
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyAround: {
    justifyContent: 'space-around',
  },
  justifyEvenly: {
    justifyContent: 'space-evenly',
  },

  // ============================================
  // Align Items
  // ============================================
  alignCenter: {
    alignItems: 'center',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignStretch: {
    alignItems: 'stretch',
  },

  // ============================================
  // Common Width/Height
  // ============================================
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  screenWidth: {
    width: width,
  },
  screenHeight: {
    height: height,
  },
  width80: {
    width: width * 0.8,
  },
  width90: {
    width: width * 0.9,
  },

  // ============================================
  // Common Margins
  // ============================================
  marginTop10: {
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
  },
  marginTop30: {
    marginTop: 30,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  marginBottom20: {
    marginBottom: 20,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  marginVertical20: {
    marginVertical: 20,
  },
  marginHorizontal10: {
    marginHorizontal: 10,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },

  // ============================================
  // Common Padding
  // ============================================
  padding10: {
    padding: 10,
  },
  padding20: {
    padding: 20,
  },
  paddingHorizontal10: {
    paddingHorizontal: 10,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  paddingVertical20: {
    paddingVertical: 20,
  },

  // ============================================
  // Text Styles
  // ============================================
  textCenter: {
    textAlign: 'center',
  },
  textWhite: {
    color: '#ffffff',
  },
  textBold: {
    fontWeight: 'bold',
  },
  fontSize14: {
    fontSize: 14,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize18: {
    fontSize: 18,
  },
  fontSize20: {
    fontSize: 20,
  },
  fontSize23: {
    fontSize: 23,
  },

  // ============================================
  // Elevation/Shadow
  // ============================================
  elevation5: {
    elevation: 5,
  },

  // ============================================
  // Absolute Position
  // ============================================
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ============================================
  // Loading/Empty States
  // ============================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

// ============================================
// Color Constants
// ============================================
export const colors = {
  primary: '#1C9ADD',
  secondary: '#767577',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  error: '#ff0000',
  success: '#00ff00',
  warning: '#ffcc00',
  gray: {
    light: '#f0f0f0',
    medium: '#999999',
    dark: '#333333',
  },
};

// ============================================
// Dimension Helpers
// ============================================
export const dimensions = {
  screenWidth: width,
  screenHeight: height,
  width80: width * 0.8,
  width90: width * 0.9,
  width70: width * 0.7,
};

export default commonStyles;
