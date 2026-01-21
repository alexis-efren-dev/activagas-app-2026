import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Text,
    View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { IconButton, Title } from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import { useSelector } from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import { IStore } from '../../../redux/store';
import { useQueryGetVehicles } from '../../../services/Vehicles/useQueryGetVehicles';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const GetVehicles = (props: any) => {

  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [user, setUser] = React.useState<any>(false);
  const [idFullGas, setIdFullGas] = React.useState<any>(false);
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
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
            setIdFullGas(props.route.params.idGasFull);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);
  React.useEffect(() => {
    if (userRedux._id !== '' && user) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: user._id,
        idGas: idFullGas,
      }));
    }
  }, [userRedux, user, idFullGas]);
  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
    }
  }, [dataVariables]);
  if (user === false || isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (user === '' || error) {
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
              initHeight={height / 5}
              initWidth={width * 0.4}
              resizeMode="contain"
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/vehicle.png',
              }} />
          </View>
          <View
            style={{
              width: width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
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
                toScreen={'VerifyUnit'}
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
