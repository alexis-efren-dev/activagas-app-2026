import {StackNavigationProp} from '@react-navigation/stack';
import React, {ReactNode} from 'react';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Card, IconButton} from 'react-native-paper';

const {height, width} = Dimensions.get('screen');

export interface GenericListCardProps {
  /** Navigation prop for screen transitions */
  navigation: StackNavigationProp<any, any>;
  /** Target screen name for navigation */
  toScreen: string;
  /** Data item to pass to the target screen */
  item: any;
  /** Additional params to pass to navigation */
  extraParams?: Record<string, any>;
  /** Custom function to call on press instead of navigation */
  onPressOverride?: () => void;
  /** Icon name (Material Community Icons) */
  icon?: string;
  /** Icon color */
  iconColor?: string;
  /** Children to render inside the card */
  children: ReactNode;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Generic List Card Component
 *
 * Base component for list cards with consistent styling.
 * Use this as the foundation for specific card types.
 *
 * @example
 * ```tsx
 * <GenericListCard
 *   navigation={navigation}
 *   toScreen="Details"
 *   item={data}
 * >
 *   <CardField label="Name" value={data.name} />
 *   <CardField label="Phone" value={data.phone} />
 * </GenericListCard>
 * ```
 */
export const GenericListCard: React.FC<GenericListCardProps> = React.memo(
  ({
    navigation,
    toScreen,
    item,
    extraParams = {},
    onPressOverride,
    icon = 'arrow-right-bold',
    iconColor = '#1C9ADD',
    children,
    testID,
  }) => {
    const handlePress = () => {
      if (onPressOverride) {
        onPressOverride();
      } else {
        navigation.navigate(toScreen, {item, ...extraParams});
      }
    };

    return (
      <View style={cardStyles.container} testID={testID}>
        <Card style={cardStyles.card}>
          <Card.Content>
            {children}
            <View style={cardStyles.actionRow}>
              <View style={cardStyles.spacer} />
              <IconButton
                icon={icon}
                iconColor={iconColor}
                size={40}
                onPress={handlePress}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  },
);

/**
 * Shared styles for list cards
 * Export these for consistent styling across card variants
 */
export const cardStyles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  card: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: (width * 0.7) / (height / 36),
  },
  title: {
    color: '#1C9ADD',
  },
  text: {
    color: 'black',
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
});

export default GenericListCard;
