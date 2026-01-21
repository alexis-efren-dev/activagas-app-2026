import React from 'react';
import {Dimensions, View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  Title,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useQueryGetReadTime} from '../../services/Configurations/useQueryGetReadTime';
import {useMutationReleasedKey} from '../../services/Maintenance/useMutationReleasedKey';
import { getKey } from '../../redux/states/keySlice';
import { handlerNfcMaintenanceAction } from '../../redux/states/handlerNfcMaintenanceSlice';
const {width} = Dimensions.get('screen');

interface IAlert {
  show: Function;
  user: any;
  navigation: any;
  serial: any;
  idVehicle: any;
}
const AlertVehicleReleased: React.FC<IAlert> = ({
  show,
  user,
  navigation,
  serial,
  idVehicle,
}) => {
  const {
    mutate,
    isPending: isLoadingMutation,
    data: dataMutation,
    isError: isErrorMutation,
  } = useMutationReleasedKey();
  const dispatch = useDispatch();
  const keys = useSelector((store: any) => store.key);
  const {data, refetch, isError, isLoading, isFetching} = useQueryGetReadTime({
    idGas: user.idGas,
  });
  const [controllerTime, setControllerTime] = React.useState<any>(false);
  const containerStyle = {
    backgroundColor: 'transparent',
    padding: width * 0.15,
  };
  const LeftContent = (props: any) => (
    <Avatar.Icon
      {...props}
      icon="account-question-outline"
      size={50}
      style={{backgroundColor: '#1C9ADD', top: -20}}
    />
  );
  React.useEffect(() => {
    if (user) {
      if (user.idGas) {
        refetch();
        mutate({idGas: user.idGas, idVehicle});
      }
    }
  }, [user]);
  React.useEffect(() => {
    if (data) {
      if (data.getReadTimeAppResolver) {
        setControllerTime(Number(data.getReadTimeAppResolver) * 1000);
        dispatch(getKey({key: ''}));
      }
    }
  }, [data]);
  if (isError) {
    return (
      <View
        style={{
          flex: 2,
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
    <Portal>
      <Modal
        visible={true}
        onDismiss={() => show(false)}
        contentContainerStyle={containerStyle}>
        <Card style={{width: width * 0.7}}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LeftContent />
          </View>
          <Card.Content
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Title style={{fontSize: 15}}>
              {isErrorMutation
                ? 'No se puede confirmar este vehiculo'
                : '¿deseas confirmar la liberacion de este vehiculo?'}
            </Title>
          </Card.Content>
          <Card.Actions
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              disabled={isLoading || isFetching || isErrorMutation}
              loading={isLoading || isFetching || isLoadingMutation}
              mode="contained"
              style={{flex: 1, margin: 2}}
              buttonColor="#1C9ADD"
              onPress={() => {
                dispatch(handlerNfcMaintenanceAction(''));
                show(false);
                navigation.navigate('ScannerScreenHce', {
                  serial,
                  user,
                  key: keys.key,
                  controllerTime: controllerTime,
                  routeRefresh: 'Dashboard',
                  isPredefinedContent: dataMutation.liberationEncryptResolver,
                });
              }}>
              Confirmar
            </Button>
            <Button
              mode="contained"
              style={{flex: 1, margin: 2}}
              buttonColor="#1C9ADD"
              onPress={() => show(false)}>
              Cancelar
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};
export default AlertVehicleReleased;
