import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ICard {
  item: any;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
}

const CardSerial: React.FC<ICard> = React.memo(({item, toScreen, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate(toScreen, {
          serialNumber: item.idDevice,
        });
      }}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name="cellphone-nfc" size={28} color="#1C9ADD" />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Número de Serie</Text>
          <Text style={styles.serialNumber} numberOfLines={1}>
            {item.serialNumber}
          </Text>
          <View style={styles.idRow}>
            <Icon name="identifier" size={14} color="#8E8E93" />
            <Text style={styles.idText} numberOfLines={1}>
              {item.idDevice}
            </Text>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <Icon name="chevron-right" size={24} color="#1C9ADD" />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serialNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idText: {
    fontSize: 13,
    color: '#8E8E93',
    flex: 1,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default CardSerial;
