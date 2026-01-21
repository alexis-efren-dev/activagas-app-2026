/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Switch} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useDispatch, useSelector} from 'react-redux';
import dataFormRegisterAditional from '../../DataForms/dataFormRegisterAditional.json';

import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {handlerFormRegisterAction} from '../../redux/states/handlerFormRegisterSlice';
import {IStore} from '../../redux/store';
import {useMutationAditionalRegister} from '../../services/Register/AditionalRegister';
import {useQueryGetSignedImages} from '../../services/Register/useQueryGetSignedImages';
import CreateServices from '../Accounting/CreateServices';
import AlertConfirmVehicleRegister from '../Alerts/AlertConfirmVehicleRegister';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {makeStyles} from '../Login/customStyles/FormLogin';
import {makeStylesFormRegisterActivation} from './makeStyles';
import RegisterImages from './RegisterImages';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IPropsAditional {
  serialNumber: any;
  idUser: any;
  services: any;
  maintenances: any;
  navigation: any;
}
interface IData {
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  municipality: string;
  address: string;
  brand: string;
  model: string;
  plates: string;
  cylinders: string;
  others: string;
  finalCredit: string;
  isWithWhatsapp: boolean;
  tankSerial: string;
  circulationSerial: string;
  inactivityDays: string;
}
const FormAditionalInfo: React.FC<IPropsAditional> = React.memo(
  ({serialNumber, idUser, services, maintenances, navigation}): JSX.Element => {
    const [tankSignedUri, setTankSignedUri] = React.useState<any>(false);
    const [pcSignedUri, setPcSignedUri] = React.useState<any>(false);
    const [vinSignedUri, setVinSignedUri] = React.useState<any>(false);
    const [videoSigned, setVideoSigned] = React.useState<any>(false);
    const [dataVariables, setDataVariables] = useState<any>({
      _id: '',
      serialNumber: '',
    });
    const [isLoadingS3, setIsLoadingS3] = useState(false);
    const dispatch = useDispatch();
    const [platesSignedUri, setPlatesSignedUri] = React.useState<any>(false);
    const [circulationSignedUri, setCirculationSignedUri] =
      React.useState<any>(false);
    const [handleShow, setHandleShow] = React.useState<any>(false);
    const [emergencyActivations, setEmergencyActivations] = React.useState<any>(
      [],
    );
    const [isWithWhatsapp, setIsWithWhatsapp] = React.useState<boolean>(false);
    const [allGas, setAllGas] = React.useState<boolean>(false);
    const [withMileage, setWithMileage] = React.useState(false);
    const onWithMileage = () => setWithMileage(!withMileage);
    const onWithWhatsapp = () => setIsWithWhatsapp(!isWithWhatsapp);
    const [saturday, setSaturday] = React.useState(false);
    const onSaturday = () => setSaturday(!saturday);
    const [endDateContract, setEndDateContract] = React.useState<any>('');
    const [sunday, setSunday] = React.useState(false);
    const onSunday = () => setSunday(!sunday);
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
      limitPay,
      policies,
    } = useSelector((store: IStore) => store.services);
    const {
      refetch,
      data: dataSigned,
      isLoading: isLoadingSigned,
      isError,
    } = useQueryGetSignedImages(dataVariables);
    const mutation = useMutationAditionalRegister();
    const {data, isPending: isLoading, isSuccess} = mutation;
    const [handlerEnd, setHandlerEnd] = React.useState<any>(true);
    const [automaticPay, setAutomaticPay] = React.useState<any>('0');
    const [totalPrice, setTotalPrice] = React.useState<any>('0');

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
      if (totalPrice === '' || automaticPay === '') {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError:
              'Debes ingresar el precio del equipo/credito y las semanas/meses de financiamiento',
            showError: true,
          }),
        );

        return;
      } else if (
        isNaN(Number(totalPrice)) ||
        String(totalPrice).indexOf('.') > -1
      ) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'El precio debe ser numerico',
            showError: true,
          }),
        );

        return;
      } else if (
        isNaN(Number(automaticPay)) ||
        String(automaticPay).indexOf('.') > -1
      ) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'El precio debe ser numerico',
            showError: true,
          }),
        );

        return;
      }
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
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'Horas de activacion emergencia no validas',
            showError: true,
          }),
        );
      } else if (verifyEmpty === 0) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'No debe haber litros o activacion sin definir',
            showError: true,
          }),
        );
      } else if (
        serviceSelect === '' ||
        !serviceSelect ||
        frequencySelect === '' ||
        !frequencySelect
      ) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'Debes seleccionar el financiamiento y frecuencia',
            showError: true,
          }),
        );
      } else if (limitPay === '') {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'Debes seleccionar la fecha de corte',
            showError: true,
          }),
        );
      } else if (
        (!maintenanceSelect ||
          maintenanceSelect === '' ||
          frequencySelectMaintenance === '' ||
          !frequencySelectMaintenance) &&
        !withOutMaintenance
      ) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'Debes seleccionar el mantenimiento y frecuencia',
            showError: true,
          }),
        );
      } else if (
        isNaN(Number(limitPay)) ||
        String(limitPay).indexOf('.') > -1
      ) {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: 'El dia de corte no es valido',
            showError: true,
          }),
        );
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
          idClient: idUser.validation,
          email: data.email,
          state: data.state,
          municipality: data.municipality,
          location: data.address,
          serialNumber: serialNumber,
          idGas: user.idGas,
          firstName: data.firstName,
          lastName: data.lastName,
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
          limitPay: Number(limitPay),
          policies: policies,
          isNaturalGas: isSwitchOn,
          automaticPay,
          withMileage,
          timeOff,
          whatsapp: data.isWithWhatsapp,
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
      if (
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
        setHandleShow({
          ...data,
          totalPrice,
          finalCredit: automaticPay,
          isWithWhatsapp,
        });
      }
    };
    if (data) {
      mutation.reset();
    }
    const buttonInfo = {
      style: makeStyles.stylesButton,
      // icon: 'arrow-right-bold',
      contentStyle: makeStyles.stylesButtonContent,
      buttonColor: '#1C9ADD',
      mode: 'contained',
    };
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const [isGeneratedServices, setIsGeneratedServices] = React.useState(false);
    const [isRegisterImages, setIsRegisterImages] = React.useState(false);
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
      if (idUser?.validation) {
        setDataVariables({_id: idUser.validation, serialNumber});
      }
    }, []);
    React.useEffect(() => {
      if (dataVariables._id) {
        refetch();
      }
    }, [dataVariables]);
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
    return (
      <LinearGradient
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width,
        }}
        colors={['#074169', '#019CDE', '#ffffff']}>
        <KeyboardAwareScrollView style={{flex: 1}}>
          <View style={{flex: 1, marginTop: 40, alignItems: 'center'}}>
            <ResponsiveImage
              initHeight={height / 6}
              initWidth={width * 0.4}
              resizeMode="contain"
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/registerInitialIcon.png',
              }}
            />
          </View>
          <View
            style={{
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
              INGRESAR DATOS
            </Text>
          </View>
          <View style={{flex: 2, alignItems: 'center', width}}>
            <AlertConfirmVehicleRegister
              setShow={setHandleShow}
              show={handleShow}
              mutation={handleSent}
            />
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

            <View
              style={{
                display: isGeneratedServices ? 'flex' : 'none',
              }}>
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
            <View
              style={{
                display:
                  isGeneratedServices || isRegisterImages ? 'none' : 'flex',
                alignItems: 'center',
              }}>
              <DynamicForm
                onSubmit={handleSubmit}
                isLoading={isLoading || isLoadingS3}
                json={dataFormRegisterAditional}
                labelSubmit="Crear"
                buttonProps={buttonInfo}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    flexDirection: 'row',
                  }}>
                  <Text style={{color: '#fff', fontSize: 20, marginRight: 10}}>
                    Whatsapp
                  </Text>
                  <Switch
                    value={isWithWhatsapp}
                    color="#1C9ADD"
                    onValueChange={onWithWhatsapp}
                  />
                </View>
                <Button
                  style={{marginVertical: 10}}
                  mode="contained"
                  buttonColor="#1C9ADD"
                  onPress={() => {
                    setIsGeneratedServices(true);
                  }}>
                  Generar Servicios
                </Button>
                <Button
                  style={{
                    marginVertical: 10,
                    display: dataSigned ? 'flex' : 'none',
                  }}
                  mode="contained"
                  buttonColor="#1C9ADD"
                  onPress={() => {
                    setIsRegisterImages(true);
                  }}>
                  Registrar imagenes
                </Button>
                <Button
                  disabled={handlerEnd}
                  style={{marginBottom: 20}}
                  mode="contained"
                  buttonColor="#1C9ADD"
                  onPress={() => {
                    dispatch(handlerFormRegisterAction(false));
                    navigation.navigate('Register', {});
                  }}>
                  Terminar
                </Button>
              </DynamicForm>

              <Text style={makeStylesFormRegisterActivation.textCondition}>
                *Los campos con el asterisco, son obligatorios.
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  },
);
export default FormAditionalInfo;
