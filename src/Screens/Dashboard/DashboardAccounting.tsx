import React from 'react';
import {Dimensions, View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';

import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';

import { IStore } from '../../redux/store';
import CardButton from '../../Components/Layout/CardButton/CardButton';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IDashboardAccounting {
  navigation: StackNavigationProp<any, any>;
}
const DashboardAccounting: React.FC<IDashboardAccounting> = ({navigation}): JSX.Element => {
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations,
  );

  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <View
        style={{
          width,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          top: 0,
        }}>
        <ResponsiveImage
          resizeMode="contain"
          initHeight={height / 9}
          initWidth={width * 0.9}
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/activawithout.png',
          }} />
      </View>
      <ResponsiveImage
        resizeMode="contain"
        initHeight={height / 4}
        initWidth={width * 0.9}
        source={{uri: generalConfigurations.imageUrl}} />
      <View style={{flex: 1}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 60,
          }}>
          <CardButton
            onHandleClick={() => {
              navigation.navigate('Home');
            }}
            label="PAGAR"
            colorsGradient={['#1B8BC6', '#1B8BC6', '#1B8BC6']}
            customStylesImage={{width: height / 14, height: height / 14}}
            customStylesContainer={{
              width: height / 7,
              height: height / 7,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: height / (height * 0.06),
            }}
            imageUrl="https://activagas-files.s3.amazonaws.com/pay.png"
            customStylesLabel={{color: 'white'}} />
        </View>

        <View
          style={{
            flex: 1,
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <CardButton
            onHandleClick={() => {
              navigation.navigate('RegisterActivation');
            }}
            label="AGREGAR"
            colorsGradient={['#1B8BC6', '#1B8BC6', '#1B8BC6']}
            customStylesImage={{width: height / 14, height: height / 14}}
            customStylesContainer={{
              width: height / 7,
              height: height / 7,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: height / (height * 0.06),
            }}
            imageUrl="https://activagas-files.s3.amazonaws.com/userplus.png"
            customStylesLabel={{color: 'white'}} />
          <CardButton
            onHandleClick={() => {
              navigation.navigate('EditUser');
            }}
            label="EDITAR"
            colorsGradient={['#1B8BC6', '#1B8BC6', '#1B8BC6']}
            customStylesImage={{width: height / 14, height: height / 14}}
            customStylesContainer={{
              width: height / 7,
              height: height / 7,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: height / (height * 0.06),
            }}
            imageUrl="https://activagas-files.s3.amazonaws.com/useredit.png"
            customStylesLabel={{color: 'white'}} />
        </View>
      </View>
    </LinearGradient>
  );
};
export default DashboardAccounting;
