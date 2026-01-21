import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Switch,
    Text,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, IconButton, Title } from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import { useSelector } from 'react-redux';
import { useMutationUpdateEnabledVehicle } from '../../services/Register/useMutationUpdateEnabledVehicle';
import { useQueryEnabledVehicle } from '../../services/Register/useQueryEnabledVehicle';
import { IStore } from '../../redux/store';

const {width, height} = Dimensions.get('screen');
const EnableVehicleById = (props: any): JSX.Element => {
  const {mutate, isPending: isLoadingMutate} =
    useMutationUpdateEnabledVehicle();
  const navigation = useNavigation();
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [user, setUser] = React.useState<any>(false);
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const onEnabledSwitch = () => setIsEnabled(!isEnabled);
  const {refetch, isError, isLoading, isFetching, data} =
    useQueryEnabledVehicle({
      idGas: userRedux.idGas,
      idVehicle: user._id,
    });

  React.useEffect(() => {
    if (userRedux) {
      if (userRedux.idGas !== '' && !controllerQuery && user) {
        refetch();
        setControllerQuery(true);
      }
    }
  }, [userRedux, user]);

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
  React.useEffect(() => {
    if (data) {
      setIsEnabled(data.getEnabledVehicleResolver);
    }
  }, [data]);

  if (isLoading || isFetching) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }

  if (!user || isError) {
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
      <View style={{flex: 1, marginTop: 35}}>
        <ResponsiveImage
          initHeight={height / 6}
          initWidth={width * 0.5}
          resizeMode="contain"
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/updatevehicle.png',
          }} />
      </View>
      <View
        style={{
          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
          VEHICULO DESHABILITADO?
        </Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Switch value={isEnabled} onValueChange={onEnabledSwitch} trackColor={{false: '#767577', true: '#1C9ADD'}} />
        <Button
          disabled={isLoadingMutate}
          loading={isLoadingMutate}
          style={{elevation: 5, marginTop: 30}}
          mode="contained"
          buttonColor="#1C9ADD"
          onPress={() =>
            mutate({
              idGas: userRedux.idGas,
              idVehicle: user._id,
              plates: user.plates,
              disabled: isEnabled,
            })
          }>
          Actualizar
        </Button>
      </View>

      <View style={{width: width * 0.9}}>
        <IconButton
          icon="arrow-left-bold"
          iconColor="#1C9ADD"
          size={50}
          onPress={() => navigation.goBack()}
        />
      </View>
    </LinearGradient>
  );
};
export default EnableVehicleById;
