import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Card, IconButton, Paragraph, Title } from 'react-native-paper';

const { height, width } = Dimensions.get('screen');

interface ICard {
  item: any;
  withFunction?: any;
  toScreen: string;
  navigation: StackNavigationProp<any, any>;
}

const CardVehicleList: React.FC<ICard> = React.memo(({ item, toScreen, navigation, withFunction = false }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>PLACAS</Title>
          <Paragraph style={styles.text}>{item.plates}</Paragraph>
          <Title style={styles.title}>MODELO</Title>
          <Paragraph style={styles.text}>{item.model}</Paragraph>

          <View style={styles.row}>
            <View style={styles.regularView} />
            <IconButton
              icon={withFunction ? 'whatsapp' : 'arrow-right-bold'}
              iconColor={withFunction ? (item.whatsappSupport ? 'green' : 'red') : '#1C9ADD'}
              size={40}
              onPress={() => {
                if (withFunction) {
                  withFunction(item.plates, item.whatsappSupport);
                } else {
                  navigation.navigate(toScreen, { item });
                }
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
  text: {
    color: 'black',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CardVehicleList;
