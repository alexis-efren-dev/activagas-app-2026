/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useDispatch, useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';

import {useNavigation} from '@react-navigation/native';
import {useQueryEmergencyActivationsClient} from '../../../services/Emergency/useQueryEmergencyActivationsClient';
import useDataLayer from '../../../hooks/useDataLayer';
import { currentPlatesAction } from '../../../redux/states/currentPlatesSlice';
import { routesAction } from '../../../redux/states/routesSlice';
import { IStore } from '../../../redux/store';
import { useQueryClient } from '@tanstack/react-query';

const {width, height} = Dimensions.get('screen');

const GetVehicles = (props: any) => {
  const [nfcSerial, setNfcSerial] = useState<any>(false);
  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: (data: string) => {
      setNfcSerial(data);
    },
  });
  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);
  const client = useQueryClient();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const currentPlates = useSelector((store: IStore) => store.currentPlates);
  const [plates, setPlates] = useState('');
  const [infoVehicle, setInfoVehicle] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    id: '',
    idGas: '',
    idVehicle: '',
  });
  const {data, error, refetch, isLoading, isFetching} =
    useQueryEmergencyActivationsClient(dataVariables);

  React.useEffect(() => {
    if (userRedux._id !== '' && nfcSerial) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: userRedux._id,
        idGas: userRedux.idGas,
        idVehicle: userRedux._id,
        plates: nfcSerial,
      }));
    } else if (
      userRedux._id &&
      plates !== '' &&
      plates !== 'plates' &&
      !nfcSerial
    ) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: userRedux._id,
        idGas: userRedux.idGas,
        idVehicle: userRedux._id,
        plates,
      }));
    }
  }, [userRedux, infoVehicle, nfcSerial, plates]);
  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
      updateProp('writable', false);
    }
  }, [dataVariables]);

  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setInfoVehicle(props.route.params.item);
            setPlates(props.route.params.item.plates);
          } else {
            setInfoVehicle('');
          }
        } else {
          setPlates(currentPlates.plates);
        }
      }
    }
  }, [props]);
  React.useEffect(() => {
    switchSession(true);
    updateProp('writable', true);
    setNfcSerial(false);
    return () => {
      client.removeQueries({queryKey:['getEmergencyVehicleResolver']});
      updateProp('writable', false);
      setNfcSerial(false);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (error || infoVehicle === '') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>No se encontraron estas placas</Title>
        <View style={{justifyContent: 'center'}}>
          <IconButton
            icon="arrow-left-bold"
            iconColor="#000"
            size={50}
            onPress={() => {
              dispatch(currentPlatesAction(''));
              dispatch(routesAction(''));
              navigation.goBack();
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#074169', '#019CDE', '#ffffff']}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color={'red'} />
        </View>
      ) : (
        <>
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
              marginTop: height / 10,
            }}>
            {data ? (
              <Text
                style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                ACTIVACIONES DISPONIBLES
              </Text>
            ) : (
              <>
                <Text
                  style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                  ACERCA EL DISPOSITIVO PARA LA BUSQUEDA DE PLACAS.
                </Text>
                <View style={{justifyContent: 'center'}}>
                  <IconButton
                    icon="arrow-left-bold"
                    iconColor="#fff"
                    size={50}
                    onPress={() => {
                      dispatch(currentPlatesAction(''));
                      dispatch(routesAction(''));
                      navigation.goBack();
                      navigation.goBack();
                    }}
                  />
                </View>
              </>
            )}
          </View>

          {enabled ? (
            <View
              style={{
                flex: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {data ? (
                <UsersFlatList
                  navigation={props.navigation}
                  isFetching={isFetching}
                  data={data.getEmergencyVehicleResolver.data}
                  limitPerPage={2}
                  toScreen={'useemergencyactivation'}
                  setDataVariables={setDataVariables}
                  dataVariables={dataVariables}
                  isEmergencyClient={true}
                  totalItems={data.getEmergencyVehicleResolver.total}
                />
              ) : null}
            </View>
          ) : (
            <View
              style={{
                width: width,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: height / 10,
              }}>
              <Text
                style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                PARA HACER USO DE ESTE MODULO, NECESITAS ACTIVAR EL NFC DE TU
                DISPOSITIVO
              </Text>
            </View>
          )}
        </>
      )}
    </LinearGradient>
  );
};
export default GetVehicles;
