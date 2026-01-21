import {StyleSheet} from 'react-native';

export const makeStylesFormRegisterActivation = StyleSheet.create({
  input: {
    width: 300,
    margin: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    position: 'absolute',
    top: '10%',
  },
  stylesButton: {
    marginTop: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylesButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginBottom: 5,
    borderColor: 'black',
    height: 4,
    backgroundColor: 'black',
  },
  textDivider: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textCondition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});

export const makeStylesTheme = {
  stylesInputNumeroTheme: {
    placeholder: 'white',
    text: 'white',
    primary: 'white',
    background: 'black',
  },
};

export const makeStylesScreenNfc = StyleSheet.create({
  container: {flex: 1},
  image: {
    flex: 1,
  },
  containerText: {
    borderColor: 'white',
    borderWidth: 2,
    top: 55,
    margin: 5,
    padding: 5,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export const imageNfc = {
  uri: 'https://activagasbeta-files.s3.amazonaws.com/native.jpg',
};
