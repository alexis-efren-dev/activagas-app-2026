import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, IconButton, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {useQueryGetPrivateGas} from '../../../services/Verification/useQueryGetPrivateGas';
import { IStore } from '../../../redux/store';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IDashboard {
  navigation: StackNavigationProp<any, any>;
}
const Dashboard: React.FC<IDashboard> = ({navigation}) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);

  const user = useSelector((store: IStore) => store.loggedUser);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    idGas: '',
  });

  const {
    data: data2,
    refetch: refetch2,
    isLoading,
    isError,
    isFetching,
  } = useQueryGetPrivateGas({
    current: dataVariables.current,
    limit: dataVariables.limit,
    fieldFind: dataVariables.fieldFind,
    idUser: userRedux._id,
  });

  React.useEffect(() => {
    if (user) {
      if (user.idGas && user.idGas !== '') {
        setDataVariables({...dataVariables, idGas: user.idGas});
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch2();
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
              initHeight={height / 5}
              initWidth={width * 0.4}
              resizeMode="contain"
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/useraccount.png',
              }} />
          </View>
          <View
            style={{
              width: width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
              GASERAS
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {data2 ? (
              <UsersFlatList
                initial={true}
                navigation={navigation}
                isFetching={isFetching}
                data={data2.gaserasPrivateResolver.data}
                limitPerPage={2}
                toScreen={'GetClientsToVerification'}
                setDataVariables={setDataVariables}
                dataVariables={dataVariables}
                totalItems={data2.gaserasPrivateResolver.total}
                isGas={true} />
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
