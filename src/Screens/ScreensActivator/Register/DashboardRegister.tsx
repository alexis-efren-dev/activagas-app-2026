import React from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ResponsiveImage from 'react-native-responsive-image';

import {Button} from 'react-native-paper';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const buttonStyles = {
  width: width / 1.5,
  backgroundColor: '#1C9ADD',
  marginBottom: 10,
  elevation: 2,
  borderRadius: height / (height * 0.2),
};
interface IProps {
  navigation: any;
}
const DashboardRegister: React.FC<IProps> = ({navigation}): JSX.Element => {
  return (
      <LinearGradient
      style={{justifyContent: 'center', alignItems: 'center',flex:1}}
      colors={['#074169', '#019CDE', '#ffffff']}>
    <ScrollView>
    <View  style={{justifyContent: 'center', alignItems: 'center'}}>
    <View style={{flex: 1, marginTop: 30}}>
        <ResponsiveImage
          initHeight={height / 6}
          initWidth={width * 0.4}
          resizeMode="contain"
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/registerInitialIcon.png',
          }} />
      </View>
      <View
        style={{
          flex: 1,
          width: width / 2.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
          REGISTRO DE DISPOSITIVO
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          width: width / 2.5,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop:30,
        }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 23,
            fontWeight: '500',
            backgroundColor: 'white',
          }}>
          IMPORTANTE
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          width: width * 0.8,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: '600',
            elevation: 5,
          }}>
          Si el cliente ya tiene equipo, dar click en “Ya soy cliente”, de lo
          contrario, click en “Primer registro” para creación inicial.
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop:30,
        }}>
        <Button
        textColor="white"
          onPress={() => navigation.navigate('Register')}
          style={buttonStyles}>
          PRIMER REGISTRO
        </Button>
        <Button
        textColor="white"
          onPress={() => navigation.navigate('RegisterPrev')}
          style={buttonStyles}>
          YA SOY CLIENTE
        </Button>

      </View>
    </View>
    </ScrollView>
    </LinearGradient>
  );
};
export default DashboardRegister;
