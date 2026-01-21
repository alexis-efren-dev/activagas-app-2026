import React from 'react';
import {View, Text, ActivityIndicator, Dimensions} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton, Title} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useQueryGetVehicleInformation} from '../../../services/Clients/useQueryGetVehicleInformation';
import {CardVehicle} from '../../../Components/CardInformation/CardVehicle';
import { IStore } from '../../../redux/store';

const {width, height} = Dimensions.get('screen');

const UpdateVehicles = (props: any) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [infoVehicle, setInfoVehicle] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    idClient: userRedux._id,
    serialNumber: '',
  });

  const {data, error, refetch, isLoading, isFetching} =
    useQueryGetVehicleInformation(dataVariables);

  React.useEffect(() => {
    if (userRedux._id !== '' && infoVehicle) {
      setDataVariables(() => ({
        idClient: userRedux._id,
        serialNumber: infoVehicle.serialNumber,
      }));
    }
  }, [userRedux, infoVehicle]);
  React.useEffect(() => {
    if (dataVariables.serialNumber !== '') {
      refetch();
    }
  }, [dataVariables]);

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
  if (isLoading || infoVehicle === false || isFetching) {
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
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 15,
              }}>
              INFORMACION DEL VEHICULO
            </Text>
          </View>

          <View style={{flex: 2}}>
            {data ? <CardVehicle vehicle={data.readUserByResolver} /> : null}
          </View>
        </>
      )}
    </LinearGradient>
  );
};
export default UpdateVehicles;
