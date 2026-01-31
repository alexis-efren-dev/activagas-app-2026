import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ICard {
  item: any;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
}

const CardEmergencyList: React.FC<ICard> = React.memo(
  ({item, toScreen, navigation}) => {
    const handlePress = () => {
      navigation.navigate(toScreen, {item});
    };

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.85}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="alarm-light" size={28} color="#E91E63" />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Activación de Emergencia</Text>
            <View style={styles.hoursRow}>
              <Icon name="clock-outline" size={16} color="#666" />
              <Text style={styles.hoursLabel}>Horas disponibles:</Text>
            </View>
            <View style={styles.valueBadge}>
              <Text style={styles.valueText}>{item.value}</Text>
              <Text style={styles.valueUnit}>hrs</Text>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Icon name="chevron-right" size={24} color="#E91E63" />
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    marginRight: 14,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  hoursLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  valueBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#FCE4EC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E91E63',
  },
  valueUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CardEmergencyList;
