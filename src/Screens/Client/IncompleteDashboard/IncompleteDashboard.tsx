/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, IconButton, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import useDataLayer from '../../../hooks/useDataLayer';
import {useMutationValidationIncomplete} from '../../../services/Activation/useMutationValidationIncomplete';
import {useQueryGetReadTime} from '../../../services/Configurations/useQueryGetReadTime';
import { IStore } from '../../../redux/store';

const {width, height} = Dimensions.get('screen');

const IncompleteDashboard = (props: any) => {
  const [variables, setVariables] = useState<any>();
  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);
  const [controllerState, setControllerState] = useState(false);
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [infoVehicle, setInfoVehicle] = React.useState<any>(false);
  const [controllerTime, setControllerTime] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);
  const {plates} = useSelector((store: IStore) => store.currentPlates);
  const {
    mutate,
    isPending: isLoadingMutation,
    reset,
  } = useMutationValidationIncomplete();
  const {data, refetch, error, isLoading, isFetching} = useQueryGetReadTime({
    idGas: user.idGas,
  });
  const [nfcSerial, setNfcSerial] = useState<any>(false);
  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: (dataNfc: string) => {
      setNfcSerial(dataNfc);
    },
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
        } else {
          setInfoVehicle({plates});
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
    if (keys.key !== '' && controllerState) {
      updateProp('writable', false);
      setControllerState(false);
      props.navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'Activation',
        variables,
        path:
          infoVehicle.plates === 'plates' ? 'incomplete' : 'incompleteClient',
      });
    }
  }, [keys]);

  React.useEffect(() => {
    if (nfcSerial && infoVehicle.plates === 'plates') {
      setControllerState(true);
      updateProp('writable', false);
      setVariables({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: nfcSerial,
      });
      mutate({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: nfcSerial,
      });
    }
  }, [nfcSerial, infoVehicle]);

  React.useEffect(() => {
    switchSession(true);
    updateProp('writable', true);
    setNfcSerial(false);
    return () => {
      reset();
      updateProp('writable', false);
      setNfcSerial(false);
    };
  }, []);

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
          }}
        />
      </View>
      <View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
          top: 30,
        }}>
        <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
          COMPLETAR ACTIVACION
        </Text>
      </View>

      {infoVehicle.plates !== 'plates' ? null : enabled &&
        infoVehicle.plates === 'plates' ? (
        <View
          style={{
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
            ACERCA EL DISPOSITIVO PARA COMPLETAR ACTIVACION
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height / 10,
          }}>
          <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
            PARA HACER USO DE ESTE MODULO, NECESITAS ACTIVAR EL NFC DE TU
            DISPOSITIVO
          </Text>
        </View>
      )}

      {infoVehicle.plates !== 'plates' ? (
        <Button
          style={{marginVertical: 30, width: width / 1.5, elevation: 5}}
          disabled={isLoadingMutation}
          loading={isLoadingMutation}
          mode="contained"
          color="#1C9ADD"
          onPress={() => {
            setControllerState(true);
            setVariables({
              idGas: user.idGas,
              idDispatcher: user._id,
              serialNumber: infoVehicle.serialPlates
                ? infoVehicle.serialPlates
                : infoVehicle.plates,
            });
            mutate({
              idGas: user.idGas,
              idDispatcher: user._id,
              serialNumber: infoVehicle.serialPlates
                ? infoVehicle.serialPlates
                : infoVehicle.plates,
            });
          }}>
          COMPLETAR
        </Button>
      ) : null}

      <View style={{width: width * 0.9}}>
        <IconButton
          icon="arrow-left-bold"
          iconColor="#1C9ADD"
          size={50}
          onPress={() => {
            if (plates === '') {
              props.navigation.goBack();
            } else {
              props.navigation.goBack();
              props.navigation.goBack();
            }
          }}
        />
      </View>
    </LinearGradient>
  );
};
export default IncompleteDashboard;
/*

*/
