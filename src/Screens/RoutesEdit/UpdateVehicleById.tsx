/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import VehicleForm from '../../Components/Accounting/VehicleForm';
import {useQueryGetMaintenances} from '../../services/Register/useQueryGetMaintenances';
import {useQueryGetServices} from '../../services/Register/useQueryGetServices';
import { IStore } from '../../redux/store';
const {width, height} = Dimensions.get('screen');
const GetPrevServices = (props: any): JSX.Element => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [user, setUser] = React.useState<any>(false);
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const {data, refetch, error, isLoading, isFetching} = useQueryGetServices({
    idGas: userRedux.idGas,
  });
  const {
    data: dataMaintenances,
    refetch: refetchMaintenances,
    isLoading: isLoadingMan,
    isFetching: isFetchingFetch,
  } = useQueryGetMaintenances({idGas: userRedux.idGas});

  const [parsedData, setParsedData] = React.useState<any>([]);
  const [parsedDataMaintenance, setParsedDataMaintenance] = React.useState<any>(
    [],
  );

  React.useEffect(() => {
    if (userRedux) {
      if (userRedux.idGas !== '' && !controllerQuery) {
        refetch();
        refetchMaintenances();
        setControllerQuery(true);
      }
    }
  }, [userRedux]);
  React.useEffect(() => {
    if (data) {
      setParsedData(data.getServicesAppResolver.data);
    }
  }, [data]);
  React.useEffect(() => {
    if (dataMaintenances) {
      setParsedDataMaintenance(
        dataMaintenances.getMaintenancesAppResolver.data,
      );
    }
  }, [dataMaintenances]);

  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);
  if (isFetching || isLoading || isLoadingMan || isFetchingFetch) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (!user || error) {
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
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{flex: 1, marginTop: 35, alignItems: 'center'}}>
          <ResponsiveImage
            initHeight={height / 6}
            initWidth={width * 0.5}
            resizeMode="contain"
            source={{
              uri: 'https://activagas-files.s3.amazonaws.com/updatevehicle.png',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
            EDITAR VEHICULO
          </Text>
        </View>
        <View style={{flex: 2}}>
          <VehicleForm
            userProp={user}
            services={parsedData}
            maintenances={parsedDataMaintenance}
            navigation={props.navigation}
          />
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default GetPrevServices;
