import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Card, IconButton, Paragraph, Title } from 'react-native-paper';

const { height, width } = Dimensions.get('screen');

interface ICard {
  item: any;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
}

const CardEmergencyList: React.FC<ICard> = React.memo(({ item, toScreen, navigation }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Horas de activación</Title>
          <View style={styles.valueContainer}>
            <Paragraph style={styles.valueText}>{item.value}</Paragraph>
          </View>
          <View style={styles.iconContainer}>
            <View style={styles.regularView} />
            <IconButton
              icon="arrow-right-bold"
              iconColor={'#1C9ADD'}
              size={40}
              onPress={() => {
                navigation.navigate(toScreen, {
                  item,
                });
              }}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
});

const styles = StyleSheet.create({
  regularView:{flex:1},
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
  valueContainer: {
    backgroundColor: '#1C9ADD',
    width: '15%',
    height: height / 20,
    borderRadius: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CardEmergencyList;
