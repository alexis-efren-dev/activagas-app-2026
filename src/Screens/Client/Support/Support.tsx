import React from 'react';
import {ActivityIndicator, Dimensions, Text, View, Linking} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useDispatch, useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {useQueryGetVehicles} from '../../../services/Vehicles/useQueryGetVehicles';
import { IStore } from '../../../redux/store';
import { getAlertSuccess } from '../../../redux/states/alertsReducerState';
const {width, height} = Dimensions.get('screen');

const GetVehicles = (props: any) => {
  const dispatch = useDispatch();
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const routes = useSelector((store: IStore) => store.routes);

  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    id: '',
    idGas: '',
  });
  const {data, error, refetch, isLoading, isFetching} =
    useQueryGetVehicles(dataVariables);

  React.useEffect(() => {
    if (userRedux._id !== '') {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: userRedux._id,
        idGas: userRedux.idGas,
      }));
    }
  }, [userRedux]);
  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
    }
  }, [dataVariables]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (error) {
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
              }} />
          </View>
          <View
            style={{
              width: width * 0.8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 'bold',
                marginVertical: 5,
              }}>
              Da click en el icono de whatsapp para ir al chat de la gasera
              propietaria.
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {data ? (
              <UsersFlatList
                withFunction={(plates: string, number: string) => {
                  if (number) {
                    let url =
                      'whatsapp://send?text=' +
                      `Hola, solicito asistencia para atender dudas sobre mi vehiculo con placas ${plates}` +
                      '&phone=52' +
                      number;
                    Linking.openURL(url)
                      .then(datast => {})
                      .catch(() => {
                        dispatch(
                          getAlertSuccess({
                            message: '',
                            show: false,
                            messageError:
                              'No pudimos abrir la aplicacion de whatsapp, revisar si se encuentra instalada en este dispositivo',
                            showError: true,
                          }),
                        );
                      });
                  } else {
                    dispatch(
                      getAlertSuccess({
                        message: '',
                        show: false,
                        messageError:
                          'La gasera aun no proporciona un numero para soporte.',
                        showError: true,
                      }),
                    );
                  }
                }}
                noBack={true}
                navigation={props.navigation}
                isFetching={isFetching}
                data={data.getVehiclesResolver.data}
                limitPerPage={2}
                toScreen={routes.route}
                setDataVariables={setDataVariables}
                dataVariables={dataVariables}
                isVehicle={true}
                totalItems={data.getVehiclesResolver.total} />
            ) : null}
          </View>
        </>
      )}
    </LinearGradient>
  );
};
export default GetVehicles;
