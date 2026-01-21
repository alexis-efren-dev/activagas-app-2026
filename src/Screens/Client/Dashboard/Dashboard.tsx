/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {useQueryGetVehicles} from '../../../services/Vehicles/useQueryGetVehicles';
import { IStore } from '../../../redux/store';
const {width, height} = Dimensions.get('screen');

const GetVehicles = (props: any) => {
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
      <KeyboardAwareScrollView
        style={{flex: 1, backgroundColor: 'transparent'}}>
        {isLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} color={'red'} />
          </View>
        ) : (
          <>
            <View style={{marginTop: 30, width, alignItems: 'center'}}>
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
                width,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                EQUIPO
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
                  navigation={props.navigation}
                  isFetching={isFetching}
                  data={data.getVehiclesResolver.data}
                  limitPerPage={2}
                  toScreen={routes.route}
                  setDataVariables={setDataVariables}
                  dataVariables={dataVariables}
                  isVehicle={true}
                  totalItems={data.getVehiclesResolver.total}
                />
              ) : null}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default GetVehicles;
