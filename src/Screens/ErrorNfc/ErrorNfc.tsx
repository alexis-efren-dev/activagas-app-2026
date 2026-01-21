import React from 'react';
import {View, ImageBackground} from 'react-native';
import { imageLogin, makeStylesScreenLogin } from '../../Components/Login/customStyles/login';

const ErrorNfc: React.FC = (): JSX.Element => {
  return (
    <View style={makeStylesScreenLogin.container}>
      <ImageBackground
        source={imageLogin}
        resizeMode="cover"
        style={makeStylesScreenLogin.image}
      />
    </View>
  );
};
export default ErrorNfc;
