import {StyleSheet} from 'react-native';
export const makeStylesScreenLogin = StyleSheet.create({
  container: {flex: 1},
  cardContainer: {borderWidth: 0, margin: 10},
  cardContent: {justifyContent: 'center', alignItems: 'center'},
  cardTitle: {fontSize: 30, color: 'white'},
  cardTitleContainer: {
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 350,
    position: 'relative',
    bottom: 50,
  },
  cardTitleContainer2: {
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 350,
    position: 'relative',
    top: 50,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
export const imageLogin = {
  uri: 'https://activagasbeta-files.s3.amazonaws.com/apperror.jpg',
};
