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

const CardFlatList: React.FC<ICard> = React.memo(({ item, toScreen, navigation }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Nombre Gasera</Title>
          <Paragraph style={styles.text}>{item.name}</Paragraph>
          <Title style={styles.title}>Teléfono</Title>
          <Paragraph style={styles.text}>{item.cellPhone}</Paragraph>
          <View style={styles.rowContainer}>
            <View>
              <Title style={styles.title}>Municipio</Title>
              <Paragraph style={styles.text}>{item.municipality}</Paragraph>
            </View>
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
  text: {
    color: 'black',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CardFlatList;
