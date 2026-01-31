import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TabBarIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

/**
 * Modern TabBarIcon component with label and focused state
 * Used for improved tab bar design
 */
export const TabBarIconModern: React.FC<TabBarIconProps> = ({icon, label, focused}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
        <Icon
          name={icon}
          size={22}
          color={focused ? '#1C9ADD' : '#8E8E93'}
        />
      </View>
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        {label}
      </Text>
    </View>
  );
};

/**
 * Legacy TabBarIcon function for backward compatibility
 * @deprecated Use TabBarIconModern instead
 */
const TabBarIcon = (icon: string) => {
  return (
    <IconButton
      icon={icon}
      iconColor="black"
      size={55}
      style={legacyStyles.tabBarIcon}
    />
  );
};

export default TabBarIcon;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconWrapper: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperFocused: {
    backgroundColor: '#E3F2FD',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
    }),
  },
  labelFocused: {
    color: '#1C9ADD',
    fontWeight: '600',
  },
});

const legacyStyles = StyleSheet.create({
  tabBarIcon: {top: 25},
});
