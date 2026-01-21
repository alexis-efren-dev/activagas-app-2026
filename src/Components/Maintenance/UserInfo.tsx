import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Paragraph,
  Title,
} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import useDataLayer from '../../hooks/useDataLayer';
import {useMutationValidationGetFirstEmergency} from '../../services/Activation/useMutationValidationGetFirstEmergency';
import {useMutationRegisterMaintenance} from '../../services/Clients/useMutationRegisterMaintenance';
import {useQueryGetInfoMaintenance} from '../../services/Clients/useQueryGetInfoMaintenance';
import {useQueryGetReadTime} from '../../services/Configurations/useQueryGetReadTime';
import {useMutationEmergencyMaintenance} from '../../services/Maintenance/useMutationEmergencyMaintenance';
import {useQueryGetInternalVin} from '../../services/Maintenance/useQueryGetInternalVin';
import AlertEmergency from '../Alerts/AlertEmergency';
import AlertVehicleConfirmation from '../Alerts/AlertVehicleConfirmation';
import AlertVehicleReleased from '../Alerts/AlertVehicleReleased';
import {IStore} from '../../redux/store';
import {useQueryClient} from '@tanstack/react-query';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IUser {
  user: any;
  navigation: StackNavigationProp<any, any>;
  cancelAction?: any;
}

const UserInfo: React.FC<IUser> = ({
  user,
  navigation,
  cancelAction = () => {},
}) => {
  const client = useQueryClient();
  const [dataInternalVariables, setDataInternalVariables] = useState<any>({
    idGas: '',
    idMaintenance: '',
    serialNumber: '',
  });

  const [controllerTime, setControllerTime] = React.useState<any>(false);

  const keys = useSelector((store: any) => store.key);
  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: (data: string) => {},
  });
  const {data: dataInternal, refetch: refetchInternal} = useQueryGetInternalVin(
    dataInternalVariables,
  );
  const {mutate: mutateFirst, reset} = useMutationValidationGetFirstEmergency();

  const [handlerAlert, setHandlerAlert] = React.useState<any>(false);
  const [showAlertConfirmation, setShowAlertConfirmation] =
    React.useState<any>(false);
  const [showAlertReleased, setShowAlertReleased] =
    React.useState<boolean>(false);
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const {
    mutate: mutateForEmergency,
    isPending: isLoadMutation,
    data: dataEmergency,
  } = useMutationEmergencyMaintenance();

  const [parsedInfo, setParsedInfo] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    idGas: '',
    idAditionalClient: '',
  });
  const {data, refetch, isLoading, isFetching, isError} =
    useQueryGetInfoMaintenance(dataVariables);
  const {
    mutate,
    isPending: isMutationLoading,
    isSuccess,
  } = useMutationRegisterMaintenance();

  const {data: dataReadTime, refetch: refetchReadTime} = useQueryGetReadTime({
    idGas: userRedux.idGas,
  });
  React.useEffect(() => {
    switchSession(false, true);
    updateProp('writable', false);
    updateProp('content', '');
  }, []);

  React.useEffect(() => {
    if (userRedux) {
      if (userRedux.idGas) {
        refetchReadTime();
      }
    }
  }, [userRedux]);
  React.useEffect(() => {
    if (dataReadTime) {
      if (dataReadTime.getReadTimeAppResolver) {
        setControllerTime(Number(dataReadTime.getReadTimeAppResolver) * 1000);
      }
    }
  }, [dataReadTime]);
  React.useEffect(() => {
    if (user && userRedux) {
      if (user._id && userRedux.idGas !== '') {
        setDataInternalVariables({
          idGas: userRedux.idGas,
          idMaintenance: userRedux._id,
          serialNumber: user.serialId,
        });
        setDataVariables({
          idGas: userRedux.idGas,
          idAditionalClient: user._id,
        });
        mutateFirst({
          idGas: userRedux.idGas,
          idMaintenance: userRedux._id,
          serialNumber: user.serialId,
        });
      }
    }
  }, [user, userRedux]);
  React.useEffect(() => {
    if (dataVariables.idGas !== '' && dataVariables.idAditionalClient !== '') {
      refetch();
    }
  }, [dataVariables]);
  React.useEffect(() => {
    if (
      dataInternalVariables.idGas !== '' &&
      dataInternalVariables.serialNumber !== ''
    ) {
      refetchInternal();
    }
  }, [dataInternalVariables]);
  React.useEffect(() => {
    if (data) {
      setParsedInfo(data.getHistoryMaintenanceResolver);
    }
  }, [data]);
  React.useEffect(() => {
    if (dataEmergency) {
      setHandlerAlert(true);
    }
  }, [dataEmergency]);

  if (isLoading || isFetching || isLoadMutation) {
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
    <ScrollView style={{flex: 1}}>
      {handlerAlert ? (
        <AlertEmergency
          navigation={navigation}
          show={setHandlerAlert}
          user={userRedux}
        />
      ) : null}
      {showAlertReleased ? (
        <AlertVehicleReleased
          navigation={navigation}
          show={setShowAlertReleased}
          user={userRedux}
          serial={user.serialId}
          idVehicle={user._id}
        />
      ) : null}
      {showAlertConfirmation ? (
        <AlertVehicleConfirmation
          navigation={navigation}
          show={setShowAlertConfirmation}
          user={userRedux}
          serial={user.serialId}
          idVehicle={user._id}
        />
      ) : null}
      <LinearGradient
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        colors={['#074169', '#019CDE', '#ffffff']}>
        <View style={{flex: 1, marginTop: 30}}>
          <ResponsiveImage
            initHeight={height / 5}
            initWidth={width * 0.4}
            resizeMode="contain"
            source={{
              uri: 'https://activagas-files.s3.amazonaws.com/userinformation.png',
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          {user.released ? (
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
              LIBERACION DE EQUIPO
            </Text>
          ) : (
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
              INFORMACION DEL USUARIO
            </Text>
          )}
        </View>
        {user.released ? (
          <View style={{minHeight: height / 1.5}}>
            <Card.Content>
              <Paragraph style={{color: 'white'}}>
                Este equipo esta listo para ser liberado de activagas, da click
                en el boton liberar para finalizar.
              </Paragraph>
              <Button
                style={{marginVertical: 30}}
                mode="contained"
                buttonColor="#1C9ADD"
                disabled={isLoadMutation}
                onPress={() => {
                  client.removeQueries({queryKey: ['getInternalVinResolver']});
                  setShowAlertReleased(true);
                }}>
                Liberar este vehiculo
              </Button>
              <Button
                style={{marginTop: 10}}
                mode="contained"
                buttonColor="red"
                onPress={() => {
                  reset();
                  cancelAction();
                  client.removeQueries({queryKey: ['getInternalVinResolver']});
                }}>
                Cancelar
              </Button>
            </Card.Content>
          </View>
        ) : (
          <View style={{flex: 2}}>
            {parsedInfo ? (
              <>
                <Card.Content>
                  {!parsedInfo.isOptional &&
                  !parsedInfo.isObligatory &&
                  !parsedInfo.isDone ? (
                    <Paragraph style={{color: 'white'}}>
                      El equipo con placas {user.plates} y modelo {user.model}{' '}
                      cuenta con un paquete de mantenimiento el cual debe hacer
                      para antes del dia {parsedInfo.parsedData} y por tanto no
                      es obligatorio hacerlo en estos momentos pero puede
                      hacerlo si asi lo desea.
                    </Paragraph>
                  ) : null}

                  {!parsedInfo.isOptional &&
                  parsedInfo.isObligatory &&
                  !parsedInfo.isDone ? (
                    <Paragraph style={{color: 'white'}}>
                      El equipo con placas {user.plates} y modelo {user.model}{' '}
                      cuenta con un paquete de mantenimiento el cual se tuvo que
                      haber echo el dia {parsedInfo.parsedData} y por tanto es
                      obligatorio hacerlo en estos momentos, realizarlo a la
                      brevedad y registrarlo.
                    </Paragraph>
                  ) : null}

                  {parsedInfo.isOptional ? (
                    <Paragraph style={{color: 'white'}}>
                      El equipo con placas {user.plates} y modelo {user.model}{' '}
                      no cuenta con el mantenimiento por parte de la gasera.
                    </Paragraph>
                  ) : null}

                  {!parsedInfo.isOptional ? (
                    <>
                      <Button
                        style={{marginBottom: 10}}
                        mode="contained"
                        buttonColor="#1C9ADD"
                        disabled={isSuccess || isMutationLoading}
                        onPress={() => {
                          mutate({
                            idGas: userRedux.idGas,
                            idAccounting: userRedux._id,
                            idClient: user._id,
                            dateToRegister: parsedInfo.nextMaintenance,
                          });
                        }}>
                        Registrar Mantenimiento
                      </Button>
                      <Button
                        style={{marginBottom: 10}}
                        mode="contained"
                        buttonColor="#1C9ADD"
                        disabled={isLoadMutation}
                        onPress={() => {
                          mutateForEmergency({
                            idGas: userRedux.idGas,
                            idVehicle: user._id,
                          });
                        }}>
                        Activacion de Emergencia
                      </Button>
                      {dataInternal?.getInternalVinResolver === false ||
                      !dataInternal ? (
                        <Button
                          style={{marginBottom: 10}}
                          mode="contained"
                          buttonColor="#1C9ADD"
                          disabled={isLoadMutation}
                          onPress={() => {
                            client.removeQueries({
                              queryKey: ['getInternalVinResolver'],
                            });
                            setShowAlertConfirmation(true);
                          }}>
                          Confirmar este vehiculo
                        </Button>
                      ) : null}
                    </>
                  ) : null}

                  {keys.key !== '' && (
                    <Button
                      style={{marginBottom: 10}}
                      mode="contained"
                      buttonColor="#1C9ADD"
                      disabled={isLoadMutation}
                      onPress={() => {
                        if (controllerTime) {
                          navigation.navigate('ScannerScreenHce', {
                            user,
                            key: keys.key,
                            controllerTime: controllerTime,
                            routeRefresh: 'Dashboard',
                            path: 'initialActivation',
                            variables: {
                              idGas: userRedux.idGas,
                              idMaintenance: userRedux._id,
                              serialNumber: user.serialId,
                            },
                          });
                        }
                      }}>
                      Activacion Inicial
                    </Button>
                  )}
                  <Button
                    style={{marginTop: 10}}
                    mode="contained"
                    buttonColor="red"
                    onPress={() => {
                      reset();
                      cancelAction();
                      client.removeQueries({
                        queryKey: ['getInternalVinResolver'],
                      });
                    }}>
                    Cancelar
                  </Button>
                </Card.Content>
              </>
            ) : null}
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
};
export default UserInfo;
