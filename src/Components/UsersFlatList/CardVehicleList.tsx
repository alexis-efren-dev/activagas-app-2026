import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ICard {
  item: any;
  withFunction?: any;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
}

const CardVehicleList: React.FC<ICard> = React.memo(
  ({item, toScreen, navigation, withFunction = false}) => {
    const handlePress = () => {
      if (withFunction) {
        withFunction(item.plates, item.whatsappSupport);
      } else {
        navigation.navigate(toScreen, {item});
      }
    };

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.85}>
        <View style={styles.card}>
          {/* Car Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="car" size={28} color="#FF9800" />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.plates}>{item.plates || 'Sin placas'}</Text>
            <View style={styles.modelRow}>
              <Icon name="car-info" size={14} color="#666" />
              <Text style={styles.model}>{item.model || 'Sin modelo'}</Text>
            </View>
            {item.disabled && (
              <View style={styles.disabledBadge}>
                <Icon name="cancel" size={12} color="#E53935" />
                <Text style={styles.disabledText}>Deshabilitado</Text>
              </View>
            )}
          </View>

          {/* Arrow or WhatsApp */}
          <View
            style={[
              styles.arrowContainer,
              withFunction && {
                backgroundColor: item.whatsappSupport ? '#E8F5E9' : '#FFEBEE',
              },
            ]}>
            <Icon
              name={withFunction ? 'whatsapp' : 'chevron-right'}
              size={24}
              color={
                withFunction
                  ? item.whatsappSupport
                    ? '#4CAF50'
                    : '#E53935'
                  : '#1C9ADD'
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    marginRight: 14,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  plates: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  model: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  disabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
  },
  disabledText: {
    fontSize: 11,
    color: '#E53935',
    fontWeight: '600',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CardVehicleList;
