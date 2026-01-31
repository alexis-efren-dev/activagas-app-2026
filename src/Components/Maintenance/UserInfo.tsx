import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useCallback} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const {width} = Dimensions.get('screen');

interface IUser {
  user: any;
  navigation: StackNavigationProp<any, any>;
  cancelAction?: any;
}

const MAINTENANCE_COLOR = '#FF9800';

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

  const terminateWriteCallback = useCallback((_data: string) => {
    // No-op callback - maintained for hook compatibility
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (userRedux?.idGas) {
      refetchReadTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRedux]);

  React.useEffect(() => {
    if (dataReadTime?.getReadTimeAppResolver) {
      setControllerTime(Number(dataReadTime.getReadTimeAppResolver) * 1000);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRedux]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '' && dataVariables.idAditionalClient !== '') {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVariables]);

  React.useEffect(() => {
    if (
      dataInternalVariables.idGas !== '' &&
      dataInternalVariables.serialNumber !== ''
    ) {
      refetchInternal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator animating={true} color={MAINTENANCE_COLOR} size="large" />
          </View>
          <Text style={styles.loadingText}>Cargando informacion...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Icon name="alert-circle" size={48} color="#E53935" />
        </View>
        <Text style={styles.errorTitle}>Error de servidor</Text>
        <Text style={styles.errorText}>
          No se pudo obtener la informacion.{'\n'}Por favor, intentalo mas tarde.
        </Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            reset();
            cancelAction();
          }}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color={MAINTENANCE_COLOR} />
          <Text style={styles.errorButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={styles.scrollView}>
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

      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon
              name={user.released ? 'car-key' : 'account-details'}
              size={36}
              color={MAINTENANCE_COLOR}
            />
          </View>
          <Text style={styles.headerTitle}>
            {user.released ? 'LIBERACION' : 'INFORMACION'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {user.released
              ? 'Liberacion de equipo del sistema'
              : 'Detalles del vehiculo y mantenimiento'}
          </Text>
        </View>

        {/* Vehicle Info Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Icon name="car" size={16} color={MAINTENANCE_COLOR} />
            <Text style={styles.badgeText}>
              {user.plates || 'Sin placas'} - {user.model || 'Sin modelo'}
            </Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {user.released ? (
            /* Released Vehicle Content */
            <View style={styles.releasedContainer}>
              <View style={styles.releaseIconWrapper}>
                <Icon name="car-key" size={48} color={MAINTENANCE_COLOR} />
              </View>
              <Text style={styles.releaseTitle}>Equipo Listo para Liberar</Text>
              <Text style={styles.releaseText}>
                Este equipo esta listo para ser liberado de ActivaGas. Presiona
                el boton para finalizar el proceso.
              </Text>

              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => {
                  client.removeQueries({queryKey: ['getInternalVinResolver']});
                  setShowAlertReleased(true);
                }}
                disabled={isLoadMutation}
                activeOpacity={0.8}>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Liberar Vehiculo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  reset();
                  cancelAction();
                  client.removeQueries({queryKey: ['getInternalVinResolver']});
                }}
                activeOpacity={0.8}>
                <Icon name="close" size={20} color="#E53935" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Normal Maintenance Content */
            <View style={styles.maintenanceContainer}>
              {parsedInfo ? (
                <>
                  {/* Status Info */}
                  <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                      <Icon
                        name={
                          parsedInfo.isOptional
                            ? 'information'
                            : parsedInfo.isObligatory
                            ? 'alert'
                            : 'calendar-check'
                        }
                        size={24}
                        color={
                          parsedInfo.isOptional
                            ? '#1976D2'
                            : parsedInfo.isObligatory
                            ? '#E53935'
                            : '#4CAF50'
                        }
                      />
                      <Text
                        style={[
                          styles.statusTitle,
                          parsedInfo.isObligatory && styles.statusTitleWarning,
                        ]}>
                        {parsedInfo.isOptional
                          ? 'Sin Mantenimiento'
                          : parsedInfo.isObligatory
                          ? 'Mantenimiento Obligatorio'
                          : 'Mantenimiento Pendiente'}
                      </Text>
                    </View>

                    <Text style={styles.statusText}>
                      {!parsedInfo.isOptional &&
                      !parsedInfo.isObligatory &&
                      !parsedInfo.isDone
                        ? `El vehiculo con placas ${user.plates} tiene un mantenimiento programado para antes del ${parsedInfo.parsedData}. Puede realizarse ahora si lo desea.`
                        : parsedInfo.isObligatory && !parsedInfo.isDone
                        ? `El vehiculo con placas ${user.plates} tenia mantenimiento programado para el ${parsedInfo.parsedData}. Es obligatorio realizarlo ahora.`
                        : parsedInfo.isOptional
                        ? `El vehiculo con placas ${user.plates} no cuenta con paquete de mantenimiento de la gasera.`
                        : ''}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  {!parsedInfo.isOptional && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={() => {
                          mutate({
                            idGas: userRedux.idGas,
                            idAccounting: userRedux._id,
                            idClient: user._id,
                            dateToRegister: parsedInfo.nextMaintenance,
                          });
                        }}
                        disabled={isSuccess || isMutationLoading}
                        activeOpacity={0.8}>
                        <Icon name="wrench" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>
                          Registrar Mantenimiento
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => {
                          mutateForEmergency({
                            idGas: userRedux.idGas,
                            idVehicle: user._id,
                          });
                        }}
                        disabled={isLoadMutation}
                        activeOpacity={0.8}>
                        <Icon name="alert-circle" size={20} color={MAINTENANCE_COLOR} />
                        <Text style={styles.secondaryButtonText}>
                          Activacion de Emergencia
                        </Text>
                      </TouchableOpacity>

                      {(dataInternal?.getInternalVinResolver === false ||
                        !dataInternal) && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.secondaryButton]}
                          onPress={() => {
                            client.removeQueries({
                              queryKey: ['getInternalVinResolver'],
                            });
                            setShowAlertConfirmation(true);
                          }}
                          disabled={isLoadMutation}
                          activeOpacity={0.8}>
                          <Icon name="check-decagram" size={20} color={MAINTENANCE_COLOR} />
                          <Text style={styles.secondaryButtonText}>
                            Confirmar Vehiculo
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}

                  {keys.key !== '' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.secondaryButton]}
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
                      }}
                      disabled={isLoadMutation}
                      activeOpacity={0.8}>
                      <Icon name="cellphone-nfc" size={20} color={MAINTENANCE_COLOR} />
                      <Text style={styles.secondaryButtonText}>
                        Activacion Inicial
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => {
                      reset();
                      cancelAction();
                      client.removeQueries({
                        queryKey: ['getInternalVinResolver'],
                      });
                    }}
                    activeOpacity={0.8}>
                    <Icon name="close" size={20} color="#E53935" />
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          )}
        </View>

        {/* Bottom Spacer for Tab Bar */}
        <View style={styles.bottomSpacer} />
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Dimensions.get('screen').height,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  releasedContainer: {
    alignItems: 'center',
  },
  releaseIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  releaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  releaseText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  maintenanceContainer: {
    width: '100%',
  },
  statusCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  statusTitleWarning: {
    color: '#E53935',
  },
  statusText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: MAINTENANCE_COLOR,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: MAINTENANCE_COLOR,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: MAINTENANCE_COLOR,
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: MAINTENANCE_COLOR,
  },
  bottomSpacer: {
    height: 120,
  },
});

export default UserInfo;
