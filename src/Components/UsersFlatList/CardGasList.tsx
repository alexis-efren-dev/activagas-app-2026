import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('screen');

interface ICard {
  item: any;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
}

const CardGasList: React.FC<ICard> = React.memo(({item, toScreen, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => navigation.navigate(toScreen, {item})}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name="gas-station" size={28} color="#1C9ADD" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.infoRow}>
            <Icon name="phone" size={14} color="#8E8E93" />
            <Text style={styles.infoText}>{item.cellPhone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={14} color="#8E8E93" />
            <Text style={styles.infoText}>{item.municipality}</Text>
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666666',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default CardGasList;
