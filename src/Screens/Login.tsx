/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import ResponsiveImage from 'react-native-responsive-image';
import FormLogin from '../Components/Login/FormLogin';
import { IStore } from '../redux/store';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Login: React.FC = (): JSX.Element => {
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations,
  );
  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#FFFFFF', '#CCCCCC', '#B3B3B3']}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{flex: 1, alignItems: 'center', marginTop: 50}}>
          <ResponsiveImage
            initHeight={height / 4}
            initWidth={width * 0.9}
            resizeMode="contain"
            source={{
              uri:
                generalConfigurations.imageUrl ===
                'https://activagas-files.s3.amazonaws.com/initialimage.png'
                  ? 'https://activagas-files.s3.amazonaws.com/activawithout.png'
                  : generalConfigurations.imageUrl,
            }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Text style={{color: '#1F97DC', fontSize: 33, fontWeight: '400'}}>
              INICIAR SESION
            </Text>
          </View>
          <FormLogin />
        </View>
        <View style={{width, alignItems: 'flex-end'}}>
          <View
            style={{
              width: width,
              height: 200,
              aspectRatio: 1 * 1.4,
            }}>
            <Image
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/backcar2.png',
              }}
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: '100%',
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default Login;
