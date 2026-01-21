import { Dimensions, StyleSheet } from 'react-native';
const width = Dimensions.get('screen').width;
export const makeStyles = StyleSheet.create({
  stylesInputNumero: {
    marginVertical: 5,
  },
  stylesButton: {
    width:width / 2.5,
    marginTop: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation:5,
    borderRadius:7,
    fontWeight:'bold',
  },
  stylesButtonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
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
