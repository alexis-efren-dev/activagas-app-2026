import React from 'react';
import {View, Text, Dimensions, ActivityIndicator} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {Button, IconButton, Title} from 'react-native-paper';
import {useQueryGetReadTime} from '../../../services/Configurations/useQueryGetReadTime';
import {useMutationValidationEmergency} from '../../../services/Activation/useMutationValidationEmergency';
import { IStore } from '../../../redux/store';

const {width, height} = Dimensions.get('screen');

const UseEmergency = (props: any) => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [infoVehicle, setInfoVehicle] = React.useState<any>(false);
  const [controllerTime, setControllerTime] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);
  const {mutate} = useMutationValidationEmergency();
  const {data, refetch, error, isLoading, isFetching} = useQueryGetReadTime({
    idGas: user.idGas,
  });
  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        refetch();
        setControllerQuery(true);
      }
    }
  }, [user]);
  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setInfoVehicle(props.route.params.item);
          } else {
            setInfoVehicle('');
          }
        }
      }
    }
  }, [props]);
  React.useEffect(() => {
    if (data) {
      if (data.getReadTimeAppResolver) {
        setControllerTime(Number(data.getReadTimeAppResolver) * 1000);
      }
    }
  }, [data]);
  React.useEffect(() => {
    if (keys.key !== '') {
      props.navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'Dashboard',
        path: 'emergency',
        variables: {
          idGas: user.idGas,
          idDispatcher: user._id,
          idKeyEmergency: infoVehicle._id,
          serialNumber: infoVehicle.serialNumber,
        },
      });
    }
  }, [keys]);

  if (isLoading || isFetching) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'blue'} />
      </View>
    );
  }
  if (infoVehicle === '' || error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }
  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <View style={{marginTop: 30}}>
        <ResponsiveImage
          initHeight={height / 7}
          initWidth={width * 0.8}
          resizeMode={'contain'}
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/vehicle.png',
          }} />
      </View>
      <View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
          top: 30,
        }}>
        <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
          ACTIVACION DE EMERGENCIA
        </Text>
      </View>
      <View
        style={{
          flex: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          style={{marginVertical: 30, width: width / 1.5, elevation: 5}}
          mode="contained"
          buttonColor="#1C9ADD"
          onPress={() => {
            mutate({
              idGas: user.idGas,
              idDispatcher: user._id,
              idKeyEmergency: infoVehicle._id,
              serialNumber: infoVehicle.serialNumber,
            });
          }}>
          ACTIVAR
        </Button>
      </View>

      <View style={{width: width * 0.9}}>
        <IconButton
          icon="arrow-left-bold"
          iconColor="#1C9ADD"
          size={50}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </View>
    </LinearGradient>
  );
};
export default UseEmergency;
