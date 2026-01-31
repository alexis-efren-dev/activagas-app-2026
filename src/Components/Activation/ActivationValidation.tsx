/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useRef} from 'react';
import {Dimensions, Text, View, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import dataFormLogin from '../../DataForms/dataFormValidate.json';
import useDataLayer from '../../hooks/useDataLayer';

import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {currentPlatesAction} from '../../redux/states/currentPlatesSlice';
import {dataBasicAction} from '../../redux/states/dataBasicSlice';
import {handlerHceSessionAction} from '../../redux/states/handlerHceSessionSlice';
import {routesAction} from '../../redux/states/routesSlice';
import {IStore} from '../../redux/store';
import {useMutationAlertResolver} from '../../services/Activation/useMutationAlertResolver';
import {useMutationGetBasicInformation} from '../../services/Activation/useMutationGetBasicInformation';
import {useMutationValidation} from '../../services/Activation/useMutationValidation';
import {useMutationCreateRelease} from '../../services/Release/create-release.service';
import {DynamicForm} from '../DynamicForms/DynamicForm';

interface IActivation {
  navigation: any;
  controllerTime: any;
  route: any;
}

const {height, width} = Dimensions.get('screen');
const ACTIVATOR_COLOR = '#4CAF50';

const ActivationValidation: React.FC<IActivation> = (props: any) => {
  const mutation = useMutationCreateRelease();
  const {data: dataRelease, reset: resetRelease} = mutation;
  const [variables, setVariables] = useState<any>();
  const [basicInformation, setBasicInformation] = useState<any>({});
  const [isVisibleBasicInformation, setIsVisibleBasicInformation] =
    useState<any>(false);
  const {navigation, controllerTime} = props;
  const dataRedux: any = useSelector((store: IStore) => store.dataBasic);
  const handlerHceSession = useSelector(
    (store: IStore) => store.handlerHceSession,
  );

  // Refs to access latest values in memoized callback
  const userRef = useRef<any>(null);
  const mutateBasicRef = useRef<any>(null);

  const terminateWriteCallback = useCallback((data: string) => {
    if (
      data !== '' &&
      data !== 'ACK' &&
      data !== 'NACK' &&
      data !== 'E00' &&
      data !== 'E01' &&
      data !== 'E02' &&
      data !== 'E03'
    ) {
      setExtractPlates(['plates', data]);
      if (mutateBasicRef.current && userRef.current) {
        mutateBasicRef.current({
          idGas: userRef.current.idGas,
          idDispatcher: userRef.current._id,
          serialNumber: data,
        });
      }
    }
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
  });

  const [extractPlates, setExtractPlates] = useState<any>('');
  const dispatch = useDispatch();
  const [handlerInit, setHandlerInit] = useState(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);
  const alerts = useSelector((store: IStore) => store.alerts);
  const [controlAlert, setControlAlert] = useState(false);
  const {mutate: mutateBasic, reset: resetBasic} =
    useMutationGetBasicInformation();

  // Keep refs updated with latest values
  userRef.current = user;
  mutateBasicRef.current = mutateBasic;

  const {
    mutate: mutateAlert,
    isPending: isLoadingAlert,
    data: dataAlert,
    reset: resetAlert,
  } = useMutationAlertResolver();
  const {mutate, isPending: isLoading, reset} = useMutationValidation();

  const handleValidation = (data: any) => {
    if (data.mileage !== 0) {
      setVariables({
        idGas: user.idGas,
        mileage: Number(data.mileage),
        serialNumber: data.plates,
        liters: Number(data.liters),
        idDispatcher: user._id,
      });
      mutate({
        idGas: user.idGas,
        mileage: Number(data.mileage),
        serialNumber: data.plates,
        liters: Number(data.liters),
        idDispatcher: user._id,
      });
    } else {
      setVariables({
        idGas: user.idGas,
        serialNumber: data.plates,
        liters: Number(data.liters),
        idDispatcher: user._id,
      });
      mutate({
        idGas: user.idGas,
        serialNumber: data.plates,
        liters: Number(data.liters),
        idDispatcher: user._id,
      });
    }
  };

  const buttonInfo = {
    style: styles.formButton,
    contentStyle: styles.formButtonContent,
    buttonColor: ACTIVATOR_COLOR,
    mode: 'contained',
  };

  const handleSubmit = (data: any) => {
    setControlAlert(false);

    if (
      data.liters === 0 ||
      data.liters === '' ||
      !data.liters ||
      data.liters === '0' ||
      isNaN(Number(data.liters)) ||
      Number(data.liters) < 0
    ) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: 'Ingresa litros validos',
          showError: true,
        }),
      );
    } else if (isNaN(Number(data.mileage)) || Number(data.mileage) < 0) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: 'Ingresa Kilometraje valido',
          showError: true,
        }),
      );
    } else if (data.plates.length < 4) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: 'Placas no validas, ingresar mas de 3 caracteres',
          showError: true,
        }),
      );
    } else {
      mutateAlert({
        idGas: user.idGas,
        plates: extractPlates[1],
      });
      handleValidation(data);
    }
  };

  React.useEffect(() => {
    if (keys.key !== '' && dataRelease?.createRelease) {
      reset();
      resetAlert();
      resetBasic();
      resetRelease();
      dispatch(dataBasicAction(false));
      navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'ActivatorActivations',
        path: 'activationvalidation',
        variables,
      });
    }
    if (keys.key !== '' && dataAlert?.getAlertToShowResolver === 'null') {
      reset();
      resetAlert();
      resetBasic();
      dispatch(dataBasicAction(false));
      navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'ActivatorActivations',
        path: 'activationvalidation',
        variables,
      });
    } else if (
      keys.key !== '' &&
      dataAlert?.getAlertToShowResolver.length > 6
    ) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: dataAlert.getAlertToShowResolver,
          showError: true,
        }),
      );
      setControlAlert(true);
      reset();
      resetAlert();
    }
  }, [keys, dataAlert, dataRelease]);

  React.useEffect(() => {
    if (controlAlert && !alerts.showError) {
      setControlAlert(false);
      resetBasic();
      dispatch(dataBasicAction(false));
      navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'ActivatorActivations',
        path: 'activationvalidation',
        variables,
      });
    }
  }, [JSON.stringify(alerts)]);

  React.useEffect(() => {
    if (handlerInit) {
      if (handlerHceSession.isEnabled) {
        switchSession(true);
        updateProp('content', 'init');
        updateProp('writable', true);
        //omit this for test
        setExtractPlates(['plates', '']);
      } else {
        switchSession(false);
        updateProp('writable', false);
        updateProp('content', '');
      }
    }
  }, [JSON.stringify(handlerHceSession), handlerInit]);

  React.useEffect(() => {
    if (dataRedux.getVehicleBasicInformationResolver) {
      setExtractPlates([
        'plates',
        dataRedux.getVehicleBasicInformationResolver.serialNumber,
      ]);
      setBasicInformation({
        plates: dataRedux.getVehicleBasicInformationResolver.plates,
        brand: dataRedux.getVehicleBasicInformationResolver.brand,
        model: dataRedux.getVehicleBasicInformationResolver.model,
        cylinders: dataRedux.getVehicleBasicInformationResolver.cylinders,
      });
      setIsVisibleBasicInformation(true);
    } else {
      setIsVisibleBasicInformation(false);
    }
  }, [JSON.stringify(dataRedux.getVehicleBasicInformationResolver)]);

  React.useEffect(() => {
    if (keys.key === '') {
      // this for dev
      /*
      setExtractPlates(["plates", "test1test1"]);
      mutateBasic({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: "test1test1",
      });

      setHandlerInit(true);
      dispatch(handlerHceSessionAction(true));
      */
    }
  }, [keys.key]);

  return (
    <KeyboardAwareScrollView style={styles.scrollView}>
      <LinearGradient
        style={[
          styles.container,
          {minHeight: isVisibleBasicInformation ? undefined : height},
        ]}
        colors={['#074169', '#019CDE']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="gas-station" size={36} color={ACTIVATOR_COLOR} />
          </View>
          <Text style={styles.headerTitle}>Activador</Text>
          <Text style={styles.headerSubtitle}>
            Escanea el dispositivo para comenzar
          </Text>
        </View>

        {isVisibleBasicInformation ? (
          <>
            {/* Instrucciones */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Icon name="information" size={20} color={ACTIVATOR_COLOR} />
                <Text style={styles.infoCardTitle}>Instrucciones</Text>
              </View>
              <Text style={styles.infoCardText}>
                Agrega los litros de carga y haz clic en "Validar" para
                confirmar los datos del vehiculo.
              </Text>
            </View>

            {/* Vehicle Info Card */}
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleCardHeader}>
                <Icon name="car" size={24} color={ACTIVATOR_COLOR} />
                <Text style={styles.vehicleCardTitle}>
                  Informacion del Vehiculo
                </Text>
              </View>

              <View style={styles.vehicleInfoRow}>
                <Text style={styles.vehicleInfoLabel}>Placas:</Text>
                <Text style={styles.vehicleInfoValue}>
                  {basicInformation.plates}
                </Text>
              </View>
              <View style={styles.vehicleInfoRow}>
                <Text style={styles.vehicleInfoLabel}>Modelo:</Text>
                <Text style={styles.vehicleInfoValue}>
                  {basicInformation.model}
                </Text>
              </View>
              <View style={styles.vehicleInfoRow}>
                <Text style={styles.vehicleInfoLabel}>Marca:</Text>
                <Text style={styles.vehicleInfoValue}>
                  {basicInformation.brand}
                </Text>
              </View>
              <View style={styles.vehicleInfoRow}>
                <Text style={styles.vehicleInfoLabel}>Cilindros:</Text>
                <Text style={styles.vehicleInfoValue}>
                  {basicInformation.cylinders}
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <DynamicForm
                setExtractData={extractPlates}
                onSubmit={handleSubmit}
                isLoading={isLoading || isLoadingAlert}
                json={dataFormLogin}
                labelSubmit="VALIDAR"
                buttonProps={buttonInfo}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <Button
                style={styles.actionButton}
                mode="contained"
                buttonColor="#FF9800"
                onPress={() => {
                  if (extractPlates[1] !== '') {
                    if (extractPlates[1] === '' || extractPlates[1].length < 2) {
                      dispatch(
                        getAlertSuccess({
                          message: '',
                          show: false,
                          messageError: 'Escanear id',
                          showError: true,
                        }),
                      );
                    } else {
                      setControlAlert(false);
                      reset();
                      resetAlert();
                      dispatch(routesAction('EmergencyDashboard'));
                      dispatch(currentPlatesAction(extractPlates[1]));
                      navigation.navigate('Home', {test: 'test'});
                    }
                  } else {
                    dispatch(
                      getAlertSuccess({
                        message: '',
                        show: false,
                        messageError: 'Escanear id',
                        showError: true,
                      }),
                    );
                  }
                }}>
                ACTIVACIONES DE EMERGENCIA
              </Button>

              <Button
                style={styles.actionButton}
                mode="contained"
                buttonColor="#1C9ADD"
                onPress={() => {
                  if (extractPlates[1] !== '') {
                    if (extractPlates[1] === '' || extractPlates[1].length < 2) {
                      dispatch(
                        getAlertSuccess({
                          message: '',
                          show: false,
                          messageError: 'Escanear id',
                          showError: true,
                        }),
                      );
                    } else {
                      setControlAlert(false);
                      reset();
                      resetAlert();

                      dispatch(currentPlatesAction(extractPlates[1]));
                      dispatch(routesAction('IncompleteDashboard'));
                      navigation.navigate('Home', {});
                    }
                  } else {
                    dispatch(
                      getAlertSuccess({
                        message: '',
                        show: false,
                        messageError: 'Escanear id',
                        showError: true,
                      }),
                    );
                  }
                }}>
                COMPLETAR ACTIVACION
              </Button>

              <Button
                style={styles.actionButton}
                mode="contained"
                buttonColor="#E53935"
                onPress={() => {
                  if (extractPlates[1] !== '') {
                    if (extractPlates[1] === '' || extractPlates[1].length < 2) {
                      dispatch(
                        getAlertSuccess({
                          message: '',
                          show: false,
                          messageError: 'Escanear id',
                          showError: true,
                        }),
                      );
                    } else {
                      mutation.mutate({
                        serialNumber: extractPlates[1],
                      });
                    }
                  } else {
                    dispatch(
                      getAlertSuccess({
                        message: '',
                        show: false,
                        messageError: 'Escanear id',
                        showError: true,
                      }),
                    );
                  }
                }}>
                LIBERAR
              </Button>
            </View>
          </>
        ) : (
          /* Scan Card - Estado inicial */
          <View style={styles.scanCard}>
            <View style={styles.scanIconWrapper}>
              <Icon name="cellphone-nfc" size={48} color={ACTIVATOR_COLOR} />
            </View>
            <Text style={styles.scanTitle}>Escanear Dispositivo</Text>
            <Text style={styles.scanSubtitle}>
              Para poder activar o realizar cualquier operacion debes escanear
              el ID de este dispositivo.
            </Text>

            {/* Steps */}
            <View style={styles.stepsContainer}>
              <View style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Acerca el dispositivo NFC al telefono
                </Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Espera a que se lea la informacion
                </Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Ingresa los litros y valida la operacion
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: width * 0.9,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: ACTIVATOR_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  infoCardText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    marginBottom: 16,
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
  vehicleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  vehicleCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleInfoLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    width: 90,
  },
  vehicleInfoValue: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  formContainer: {
    width: width * 0.9,
    marginBottom: 16,
  },
  formButton: {
    borderRadius: 12,
  },
  formButtonContent: {
    paddingVertical: 6,
  },
  actionButtonsContainer: {
    width: width * 0.9,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width * 0.9,
    alignItems: 'center',
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
  scanIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scanTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ACTIVATOR_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ActivationValidation;
