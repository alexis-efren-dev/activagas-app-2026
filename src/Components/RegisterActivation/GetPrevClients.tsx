import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ResponsiveImage from 'react-native-responsive-image';

import {ActivityIndicator, IconButton, Title} from 'react-native-paper';
import {useSelector} from 'react-redux';

import {useQueryGetClients} from '../../services/Clients/useQueryGetClients';
import UsersFlatList from '../UsersFlatList/UsersFlatList';
import { IStore } from '../../redux/store';
/*
interface IDashboard {
  navigation: StackNavigationProp<any, any>;
  serialNumber: any;
}
*/
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const Dashboard: React.FC<any> = ({navigation, serialNumber}) => {
  const user = useSelector((store: IStore) => store.loggedUser);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    idGas: '',
  });

  const {data, refetch, isLoading, isError, isFetching} =
    useQueryGetClients(dataVariables);
  React.useEffect(() => {
    if (user) {
      if (user.idGas && user.idGas !== '') {
        setDataVariables({...dataVariables, idGas: user.idGas});
      }
    }
  }, [user]);

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
  if (isError) {
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
              initHeight={height / 6}
              resizeMode="contain"
              initWidth={width * 0.4}
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/useraccount.png',
              }} />
          </View>
          <View
            style={{
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
              BUSCA Y SELECCIONA
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
                navigation={navigation}
                isFetching={isFetching}
                data={data.getClientsResolver.data}
                limitPerPage={2}
                toScreen={'RegisterPrevVehicle'}
                serialNumber={serialNumber}
                setDataVariables={setDataVariables}
                dataVariables={dataVariables}
                totalItems={data.getClientsResolver.total} />
            ) : null}
          </View>
        </>
      )}
    </LinearGradient>
  );
};
export default Dashboard;
/*



*/
