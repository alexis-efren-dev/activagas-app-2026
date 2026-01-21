import React from 'react';
import {Dimensions, View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';

import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import CardButton from '../../../Components/Layout/CardButton/CardButton';
import {IStore} from '../../../redux/store';
import {getAlertSuccess} from '../../../redux/states/alertsReducerState';
import { routesAction } from '../../../redux/states/routesSlice';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IDashboardAccounting {
  navigation: StackNavigationProp<any, any>;
}
const Login: React.FC<IDashboardAccounting> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations,
  );

  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);

  React.useEffect(() => {
    if (!enabled) {
      navigation.navigate('Dashboard');
    }
  }, [enabled]);

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
        initWidth={width * 0.5}
        source={{uri: generalConfigurations.imageUrl}} />
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <CardButton
            onHandleClick={() => {
              if (!enabled) {
                dispatch(
                  getAlertSuccess({
                    message: '',
                    show: false,
                    messageError:
                      'Este modulo solo funciona con nfc, verifica que tu dispositivo tiene esta tecnologia y activala',
                    showError: true,
                  }),
                );
              } else {
                dispatch(routesAction('EmergencyDashboard'));
                navigation.navigate('Home');
              }
            }}
            label="Activaciones Emergencia"
            colorsGradient={['#1B8BC6', '#1B8BC6', '#1B8BC6']}
            customStylesImage={{width: height / 14, height: height / 14}}
            customStylesContainer={{
              width: height / 7,
              height: height / 7,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: height / (height * 0.06),
            }}
            imageUrl="https://activagas-files.s3.amazonaws.com/updatevehicle.png"
            customStylesLabel={{color: 'white'}} />
          <CardButton
            onHandleClick={() => {
              if (!enabled) {
                dispatch(
                  getAlertSuccess({
                    message: '',
                    show: false,
                    messageError:
                      'Este modulo solo funciona con nfc, verifica que tu dispositivo tiene esta tecnologia y activala',
                    showError: true,
                  }),
                );
              } else {
                dispatch(routesAction('IncompleteDashboard'));
                navigation.navigate('HomeIncomplete');
              }
            }}
            label="Completar Activacion"
            colorsGradient={['#1B8BC6', '#1B8BC6', '#1B8BC6']}
            customStylesImage={{width: height / 14, height: height / 14}}
            customStylesContainer={{
              width: height / 7,
              height: height / 7,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: height / (height * 0.06),
            }}
            imageUrl="https://activagas-files.s3.amazonaws.com/updatevehicle.png"
            customStylesLabel={{color: 'white'}} />
        </View>

        <View
          style={{
            flex: 1,
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <CardButton
            onHandleClick={() => {
              navigation.navigate('UpdateProfile');
            }}
            label="MI PERFIL"
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
          <CardButton
            onHandleClick={() => {
              dispatch(routesAction('UpdateVehicles'));
              navigation.navigate('HomeVehicle');
            }}
            label="VEHICULOS"
            colorsGradient={['#1B8BC6', '#1B8BC6', '#1B8BC6']}
            customStylesImage={{width: height / 14, height: height / 14}}
            customStylesContainer={{
              width: height / 7,
              height: height / 7,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: height / (height * 0.06),
            }}
            imageUrl="https://activagas-files.s3.amazonaws.com/vehicle.png"
            customStylesLabel={{color: 'white'}} />
        </View>
      </View>
    </LinearGradient>
  );
};
export default Login;
