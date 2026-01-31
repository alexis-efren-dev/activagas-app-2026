import React, {useState, useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import dataFormRegisterAditional from '../../DataForms/dataFormPrevUser.json';

import {useMutationAditionalVehicle} from '../../services/Register/useMutationAditionalVehicle';
import {useQueryGetSignedImages} from '../../services/Register/useQueryGetSignedImages';
import CreateServices from '../Accounting/CreateServices';
import AlertConfirmVehicleRegister from '../Alerts/AlertConfirmVehicleRegister';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import RegisterImages from './RegisterImages';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {handlerFormRegisterAction} from '../../redux/states/handlerFormRegisterSlice';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

interface IPropsAditional {
  serialNumber: any;
  idUser: any;
  services: any;
  maintenances: any;
  navigation: any;
}

interface IData {
  brand: string;
  model: string;
  plates: string;
  cylinders: string;
  others: string;
  circulationSerial: string;
  tankSerial: string;
  inactivityDays: string;
}

const FormPrevRegister: React.FC<IPropsAditional> = React.memo(
  ({serialNumber, idUser, services, maintenances, navigation}): JSX.Element => {
    const [tankSignedUri, setTankSignedUri] = React.useState<any>(false);
    const [pcSignedUri, setPcSignedUri] = React.useState<any>(false);
    const [vinSignedUri, setVinSignedUri] = React.useState<any>(false);
    const [videoSigned, setVideoSigned] = React.useState<any>(false);
    const [isLoadingS3, setIsLoadingS3] = useState(false);
    const [platesSignedUri, setPlatesSignedUri] = React.useState<any>(false);
    const [circulationSignedUri, setCirculationSignedUri] =
      React.useState<any>(false);
    const [isRegisterImages, setIsRegisterImages] = React.useState(false);
    const [dataVariables, setDataVariables] = useState<any>({
      _id: '',
      serialNumber: '',
    });
    const {
      refetch,
      data: dataSigned,
      isLoading: isLoadingSigned,
      isError,
    } = useQueryGetSignedImages(dataVariables);
    console.log("EH3",dataSigned)
    const [handlerEnd, setHandlerEnd] = React.useState<any>(true);
    const dispatch = useDispatch();
    const formRef = useRef<any>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }, [pulseAnim]);

    const dispatchErrors = (message: string) => {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: message,
          showError: true,
        }),
      );
    };
    const user = useSelector((store: IStore) => store.loggedUser);
    const {
      serviceSelect,
      frequencySelect,
      maintenanceSelect,
      frequencySelectMaintenance,
      policies,
      limitPay,
    } = useSelector((store: IStore) => store.services);
    const mutation = useMutationAditionalVehicle();
    const [endDateContract, setEndDateContract] = React.useState<any>('');
    const {data, isPending: isLoading, isSuccess} = mutation;
    const [handleShow, setHandleShow] = React.useState<any>(false);
    const [allGas, setAllGas] = React.useState<boolean>(false);
    const [emergencyActivations, setEmergencyActivations] = React.useState<any>(
      [],
    );
    const [automaticPay, setAutomaticPay] = React.useState<any>('');
    const [totalPrice, setTotalPrice] = React.useState<any>('');
    const handleSent = (data: IData) => {
      let withOutMaintenance = false;
      for (let i = 0; i < maintenances.length; i++) {
        if (maintenanceSelect === maintenances[i]._id) {
          if (maintenances[i].name === 'Sin mantenimiento') {
            withOutMaintenance = true;
          }
        }
      }
      let errorInsideActivations = 0;
      emergencyActivations.map((dataActivation: any) => {
        if (
          Number(dataActivation.value) <= 0 ||
          dataActivation.value === '' ||
          isNaN(Number(dataActivation.value))
        ) {
          errorInsideActivations += 1;
        }
      });
      let verifyEmpty = 0;
      if (policies.length > 0) {
        for (let i of policies) {
          verifyEmpty = 1;
          if (
            i.liters == '0' ||
            isNaN(Number(i.liters)) ||
            Number(i.liters) < 0 ||
            i.liters === ''
          ) {
            verifyEmpty = 0;
          }
          if (
            i.activation == '0' ||
            isNaN(Number(i.activation)) ||
            Number(i.activation) < 0 ||
            i.activation === ''
          ) {
            verifyEmpty = 0;
          }
        }
      }
      if (errorInsideActivations > 0) {
        dispatchErrors('Horas de activacion emergencia no validas');
      } else if (verifyEmpty === 0) {
        dispatchErrors('No debe haber litros o activacion sin definir');
      } else if (limitPay === '') {
        dispatchErrors('Debes seleccionar la fecha de corte');
      } else if (serviceSelect === '' || frequencySelect === '') {
        dispatchErrors('Debes seleccionar el financiamiento y frecuencia');
      } else if (
        isNaN(Number(limitPay)) ||
        String(limitPay).indexOf('.') > -1
      ) {
        dispatchErrors('El dia de corte debe ser un numero');
      } else if (
        (!maintenanceSelect ||
          maintenanceSelect === '' ||
          frequencySelectMaintenance === '' ||
          !frequencySelectMaintenance) &&
        !withOutMaintenance
      ) {
        dispatchErrors('Debes seleccionar el mantenimiento y frecuencia');
      } else if (totalPrice === '' || automaticPay === '') {
        dispatchErrors(
          'Debes ingresar el precio del equipo/credito y las semanas/meses de financiamiento, si el equipo es gratis, ingresa 0 en ambos campos',
        );
      } else if (
        isNaN(Number(totalPrice)) ||
        String(totalPrice).indexOf('.') > -1
      ) {
        dispatchErrors('El precio debe ser numerico');
      } else if (
        isNaN(Number(automaticPay)) ||
        String(automaticPay).indexOf('.') > -1
      ) {
        dispatchErrors('El precio debe ser numerico');
      } else if (
        isNaN(Number(data.cylinders)) ||
        String(data.cylinders).indexOf('.') > -1
      ) {
        dispatchErrors('El numero de cilindros debe ser numerico');
      } else if (
        isNaN(Number(data.inactivityDays)) ||
        String(data.inactivityDays).indexOf('.') > -1 ||
        Number(data.inactivityDays) <= 0
      ) {
        dispatchErrors('Dias de inactividad no validos');
      } else {
        mutation.mutate({
          idClient: idUser._id,
          serialNumber: serialNumber,
          idGas: user.idGas,
          brand: data.brand,
          model: data.model,
          plates: data.plates.toUpperCase(),
          others: data.others,
          cylinders: data.cylinders,
          idService: serviceSelect,
          frequencySelected: frequencySelect,
          idMaintenance: maintenanceSelect,
          frequencySelectMaintenance: frequencySelectMaintenance || '0',
          totalPrice,
          policies,
          limitPay: Number(limitPay),
          isNaturalGas: isSwitchOn,
          automaticPay,
          withMileage,
          timeOff,
          vehicleEmergencyActivations: emergencyActivations,
          allGas,
          circulationSerial: data.circulationSerial,
          tankSerial: data.tankSerial,
          endDateContract: String(endDateContract),
          inactivityDays: data.inactivityDays,
        });
      }
    };
    const handleSubmit = (data: IData) => {
      if (automaticPay === '') {
        dispatchErrors(
          'Debes ingresar las semanas/meses de financiamiento, si el equipo es gratis, ingresa 0 en ambos campos',
        );
      } else if (
        !platesSignedUri ||
        !circulationSignedUri ||
        !videoSigned ||
        !vinSignedUri ||
        !pcSignedUri ||
        !tankSignedUri
      ) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'Registra las fotografias/video',
            showError: true,
          }),
        );
      } else {
        setHandleShow({...data, totalPrice, finalCredit: automaticPay});
      }
    };
    if (data) {
      mutation.reset();
    }
    const buttonInfo = {
      style: {display: 'none'},
      contentStyle: {display: 'none'},
    };
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [withMileage, setWithMileage] = React.useState(false);
    const onWithMileage = () => setWithMileage(!withMileage);

    const [saturday, setSaturday] = React.useState(false);
    const onSaturday = () => setSaturday(!saturday);

    const [sunday, setSunday] = React.useState(false);
    const onSunday = () => setSunday(!sunday);

    const [isGeneratedServices, setIsGeneratedServices] = React.useState(false);
    const [timeOff, setTimeOff] = React.useState<any>([]);
    const handleSignedImagesUpload = async () => {
      try {
        setIsLoadingS3(true);
        const responseSatu = await fetch(platesSignedUri);
        const imageBlob = await responseSatu.blob();
        await fetch(dataSigned.getSignedImagesResolver.urlPlates, {
          method: 'PUT',
          body: imageBlob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        const circulationTransformationBlob = await fetch(circulationSignedUri);
        const imageBlobCirculation = await circulationTransformationBlob.blob();
        await fetch(dataSigned.getSignedImagesResolver.urlCirculation, {
          method: 'PUT',
          body: imageBlobCirculation,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        const videoTransformationBlob = await fetch(videoSigned);
        const videoBlob = await videoTransformationBlob.blob();
        await fetch(dataSigned.getSignedImagesResolver.urlVideo, {
          method: 'PUT',
          body: videoBlob,
          headers: {
            'Content-Type': 'video/mp4',
          },
        });

        const vinTransformationBlob = await fetch(vinSignedUri);
        const vinBlob = await vinTransformationBlob.blob();
        await fetch(dataSigned.getSignedImagesResolver.urlVin, {
          method: 'PUT',
          body: vinBlob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        const pcTransformationBlob = await fetch(pcSignedUri);
        const pcBlob = await pcTransformationBlob.blob();
        await fetch(dataSigned.getSignedImagesResolver.urlPC, {
          method: 'PUT',
          body: pcBlob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        const tankTransformationBlob = await fetch(tankSignedUri);
        const tankBlob = await tankTransformationBlob.blob();
        await fetch(dataSigned.getSignedImagesResolver.urlTank, {
          method: 'PUT',
          body: tankBlob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });
      } catch (e) {
      } finally {
        setPlatesSignedUri(null);
        setCirculationSignedUri(null);
        setTankSignedUri(false);
        setVideoSigned(false);
        setPcSignedUri(false);
        setVinSignedUri(false);
        setIsLoadingS3(false);
      }
    };
    React.useEffect(() => {
      
      if (idUser?.idClientSigned) {
        setDataVariables({_id: idUser.idClientSigned, serialNumber});
      }
    }, []);
    React.useEffect(() => {
      if (dataVariables._id) {
        refetch();
      }
    }, [dataVariables]);

    // Log signed URLs when received
    React.useEffect(() => {
      if (dataSigned) {
     
     //   console.log('=== getSignedImagesResolver URLs (Ya soy cliente) ===');
     //   console.log(JSON.stringify(dataSigned.getSignedImagesResolver, null, 2));
     //   console.log('=====================================================');
      }
    }, [dataSigned]);
    React.useEffect(() => {
      if (sunday) {
        const replaceDays = timeOff.filter((previous: any) => previous != 0);
        replaceDays.push(0);
        setTimeOff(replaceDays);
      } else {
        const replaceDays = timeOff.filter((previous: any) => previous != 0);
        setTimeOff(replaceDays);
      }
    }, [sunday]);
    React.useEffect(() => {
      if (saturday) {
        const replaceDays = timeOff.filter((previous: any) => previous != 6);
        replaceDays.push(6);
        setTimeOff(replaceDays);
      } else {
        const replaceDays = timeOff.filter((previous: any) => previous != 6);
        setTimeOff(replaceDays);
      }
    }, [saturday]);
    React.useEffect(() => {
      if (isSuccess) {
        handleSignedImagesUpload().finally(() => {
          setHandlerEnd(false);
        });
      }
    }, [isSuccess]);

    const isBusy = isLoading || isLoadingS3;

    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Icon name="car" size={36} color="#1C9ADD" />
            </View>
            <Text style={styles.headerTitle}>Ingresar Datos</Text>
            <Text style={styles.headerSubtitle}>
              Completa la información del vehículo
            </Text>
          </View>

          {/* Client Info Badge */}
          <View style={styles.clientBadge}>
            <View style={styles.clientAvatarContainer}>
              <Icon name="account-check" size={18} color="#4CAF50" />
            </View>
            <View style={styles.clientInfoContainer}>
              <Text style={styles.clientName}>{idUser.firstName || 'Cliente'}</Text>
              <Text style={styles.clientPhone}>{idUser.cellPhone || ''}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <AlertConfirmVehicleRegister
              setShow={setHandleShow}
              show={handleShow}
              mutation={handleSent}
            />

            {/* Register Images View */}
            <View style={{display: isRegisterImages ? 'flex' : 'none'}}>
              <RegisterImages
                tankSignedUri={tankSignedUri}
                setTankSignedUri={setTankSignedUri}
                pcSignedUri={pcSignedUri}
                setPcSignedUri={setPcSignedUri}
                vinSignedUri={vinSignedUri}
                setVinSignedUri={setVinSignedUri}
                setVideoSigned={setVideoSigned}
                videoSigned={videoSigned}
                setIsRegisterImages={setIsRegisterImages}
                platesSignedUri={platesSignedUri}
                setPlatesSignedUri={setPlatesSignedUri}
                circulationSignedUri={circulationSignedUri}
                setCirculationSignedUri={setCirculationSignedUri}
              />
            </View>

            {/* Create Services View */}
            <View style={{display: isGeneratedServices ? 'flex' : 'none'}}>
              <CreateServices
                endDateContract={endDateContract}
                setEndDateContract={setEndDateContract}
                onAllGas={setAllGas}
                allGas={allGas}
                emergencyActivations={emergencyActivations}
                setEmergencyActivations={setEmergencyActivations}
                saturday={saturday}
                sunday={sunday}
                onSaturday={onSaturday}
                onSunday={onSunday}
                totalPrice={totalPrice}
                setTotalPrice={setTotalPrice}
                automaticPay={automaticPay}
                setAutomaticPay={setAutomaticPay}
                setIsGeneratedServices={setIsGeneratedServices}
                services={services}
                maintenances={maintenances}
                isSwitchOn={isSwitchOn}
                onToggleSwitch={onToggleSwitch}
                withMileage={withMileage}
                onWithMileage={onWithMileage}
              />
            </View>

            {/* Main Form View */}
            <View
              style={{
                display:
                  isGeneratedServices || isRegisterImages ? 'none' : 'flex',
                alignItems: 'center',
                width: width * 0.9,
              }}>
              {/* Form */}
              <DynamicForm
                onSubmit={handleSubmit}
                isLoading={isBusy}
                json={dataFormRegisterAditional}
                labelSubmit=""
                buttonProps={buttonInfo}
                showButton={false}
                formRef={formRef}
              />

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setIsGeneratedServices(true)}
                  activeOpacity={0.8}>
                  <LinearGradient
                    style={styles.actionButtonGradient}
                    colors={['#1C9ADD', '#0D7ABC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}>
                    <Icon name="cog" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Generar Servicios</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {dataSigned && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setIsRegisterImages(true)}
                    activeOpacity={0.8}>
                    <LinearGradient
                      style={styles.actionButtonGradient}
                      colors={['#FF9800', '#F57C00']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}>
                      <Icon name="camera" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>
                        Registrar Imágenes
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* Submit Button */}
              <Animated.View
                style={[
                  styles.buttonWrapper,
                  {transform: [{scale: pulseAnim}]},
                ]}>
                <TouchableOpacity
                  style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
                  onPress={() => formRef.current?.handleSubmit()}
                  disabled={isBusy}
                  activeOpacity={0.8}>
                  <LinearGradient
                    style={styles.buttonGradient}
                    colors={isBusy ? ['#666', '#888'] : ['#4CAF50', '#388E3C']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}>
                    {isBusy ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Icon name="check" size={22} color="#FFFFFF" />
                    )}
                    <Text style={styles.buttonText}>
                      {isBusy ? 'Procesando...' : 'Crear Registro'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Finish Button */}
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  handlerEnd && styles.buttonDisabledSecondary,
                ]}
                disabled={handlerEnd}
                onPress={() => {
                  dispatch(handlerFormRegisterAction(false));
                  navigation.navigate('Register', {});
                }}
                activeOpacity={0.8}>
                <Icon
                  name="check-circle"
                  size={20}
                  color={handlerEnd ? '#999' : '#4CAF50'}
                />
                <Text
                  style={[
                    styles.finishButtonText,
                    handlerEnd && styles.finishButtonTextDisabled,
                  ]}>
                  Terminar
                </Text>
              </TouchableOpacity>

              {/* Note */}
              <Text style={styles.requiredNote}>
                * Los campos con asterisco son obligatorios
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  clientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 24,
    gap: 12,
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
  clientAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientInfoContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  clientPhone: {
    fontSize: 13,
    color: '#666',
  },
  content: {
    width: width,
    alignItems: 'center',
  },
  actionButtonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButton: {
    width: width * 0.7,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4CAF50',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: width * 0.7,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 16,
    gap: 10,
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
  buttonDisabledSecondary: {
    opacity: 0.5,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  finishButtonTextDisabled: {
    color: '#999',
  },
  requiredNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default FormPrevRegister;
