/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import dataFormRegisterAditional from "../../DataForms/dataFormPrevUser.json";
import { getAlertSuccess } from "../../redux/states/alertsReducerState";
import { handlerFormRegisterAction } from "../../redux/states/handlerFormRegisterSlice";
import { IStore } from "../../redux/store";
import { useMutationRequestUpdateVehicle } from "../../services/Accounting/useMutationRequestUpdateVehicle";
import { useQueryGetInfoVehicleToEdit } from "../../services/Accounting/useQueryGetInfoVehicleToEdit";
import { useQueryGetSignedImages } from "../../services/Register/useQueryGetSignedImages";
import updateImages from "../../utils/updateImages";
import { DynamicForm } from "../DynamicForms/DynamicForm";
import { makeStyles } from "../Login/customStyles/FormLogin";
import { makeStylesFormRegisterActivation } from "../RegisterActivation/makeStyles";
import RegisterImages from "../RegisterActivation/RegisterImages";
import CreateEditServices from "./CreateEditServices";
const { width } = Dimensions.get("screen");
interface IPropsAditional {
  services: any;
  maintenances: any;
  userProp: any;
  navigation: any;
}
interface IData {
  brand: string;
  model: string;
  plates: string;
  cylinders: string;
  others: string;
  totalPrice: string;
  tankSerial: string;
  circulationSerial: string;
  inactivityDays: string;
}
const VehicleForm: React.FC<IPropsAditional> = React.memo(
  ({ services, maintenances, navigation, userProp }): JSX.Element => {
    const [isLoadingS3, setIsLoadingS3] = React.useState(false);
    const [tankSignedUri, setTankSignedUri] = React.useState<any>(false);
    const [pcSignedUri, setPcSignedUri] = React.useState<any>(false);
    const [vinSignedUri, setVinSignedUri] = React.useState<any>(false);
    const [videoSigned, setVideoSigned] = React.useState<any>(false);
    const [platesSignedUri, setPlatesSignedUri] = React.useState<any>(false);
    const [circulationSignedUri, setCirculationSignedUri] =
      React.useState<any>(false);
    const [dataVariables, setDataVariables] = React.useState<any>(false);
    const [parsedJson, setParsedJson] = React.useState<any>(false);
    const dispatch = useDispatch();
    const user = useSelector((store: IStore) => store.loggedUser);
    const [emergencyActivations, setEmergencyActivations] = React.useState<any>(
      [],
    );
    const [endDateContract, setEndDateContract] = React.useState("");
    const [newCredit, setNewCredit] = React.useState("");
    const [totalPrice, setTotalPrice] = React.useState<any>("");
    const [automaticPay, setAutomaticPay] = React.useState<any>("");
    const [isGeneratedServices, setIsGeneratedServices] = React.useState(false);
    const {
      serviceSelect,
      frequencySelect,
      maintenanceSelect,
      frequencySelectMaintenance,
      policies,
      limitPay,
    } = useSelector((store: IStore) => store.services);
    const mutation = useMutationRequestUpdateVehicle();
    const {
      data: dataQuery,
      refetch,
      error,
      isLoading,
      isFetching,
    } = useQueryGetInfoVehicleToEdit(dataVariables);
    const { data } = mutation;
    const [withMileage, setWithMileage] = React.useState(false);
    const [allGas, setAllGas] = React.useState(false);
    const onWithMileage = () => setWithMileage(!withMileage);
    const [isRegisterImages, setIsRegisterImages] = React.useState(false);
    const [saturday, setSaturday] = React.useState(false);
    const onSaturday = () => setSaturday(!saturday);

    const [sunday, setSunday] = React.useState(false);
    const onSunday = () => setSunday(!sunday);
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [dataVariablesSigned, setDataVariablesSigned] = React.useState<any>({
      _id: "",
      serialNumber: "",
    });
    const {
      refetch: refetchSigned,
      data: dataSigned,
      isLoading: isLoadingSigned,
    } = useQueryGetSignedImages(dataVariablesSigned);
    console.log("EH",dataSigned)
    const handleSubmit = async (data: IData) => {
      let errorInsideActivations = 0;
      emergencyActivations.map((dataActivation: any) => {
        if (
          Number(dataActivation.value) <= 0 ||
          dataActivation.value === "" ||
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
            i.liters == "0" ||
            isNaN(Number(i.liters)) ||
            Number(i.liters) < 0 ||
            i.liters === ""
          ) {
            verifyEmpty = 0;
          }
          if (
            i.activation == "0" ||
            isNaN(Number(i.activation)) ||
            Number(i.activation) < 0 ||
            i.activation === ""
          ) {
            verifyEmpty = 0;
          }
        }
      }
      if (errorInsideActivations > 0) {
        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "Horas de activacion emergencia no validas",
            showError: true,
          }),
        );
      } else if (verifyEmpty === 0) {
        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "No debe haber litros o activacion sin definir",
            showError: true,
          }),
        );
      } else if (limitPay === "") {
        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "Debes seleccionar la fecha de corte",
            showError: true,
          }),
        );
      } else if (serviceSelect === "" || frequencySelect === "") {
        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "Debes seleccionar el financiamiento y frecuencia",
            showError: true,
          }),
        );
      } else if (
        isNaN(Number(limitPay)) ||
        String(limitPay).indexOf(".") > -1
      ) {
        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "El dia de corte debe ser un numero",
            showError: true,
          }),
        );
      } else if (
        maintenanceSelect === "" ||
        frequencySelectMaintenance === ""
      ) {
        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "Debes seleccionar el mantenimiento y frecuencia",
            showError: true,
          }),
        );
      } else {
        try {
          const satu = await mutation.mutateAsync({
            _id: dataQuery.getInfoVehicleToEditResolver._id,
            idPayment: dataQuery.getInfoVehicleToEditResolver._id,
            idGas: user.idGas,
            brand: data.brand,
            model: data.model,
            inactivityDays: data.inactivityDays,
            circulationSerial: data.circulationSerial,
            tankSerial: data.tankSerial,
            plates: data.plates.toUpperCase(),
            others: data.others,
            cylinders: data.cylinders,
            idService: serviceSelect,
            frequencySelected: frequencySelect,
            idMaintenance: maintenanceSelect,
            frequencySelectMaintenance: frequencySelectMaintenance,
            totalPrice,
            policies,
            limitPay: Number(limitPay),
            isNaturalGas: isSwitchOn,
            finalDateToPay: automaticPay,
            withMileage,
            timeOff,
            vehicleEmergencyActivations: emergencyActivations,
            allGas,
            endDateContract,
            newCredit,
          });
        } catch(e) {
         
        }
        setIsLoadingS3(true);
        await updateImages(
          {
            pcSignedUri,
            vinSignedUri,
            tankSignedUri,
            platesSignedUri,
            circulationSignedUri,
            videoSigned,
          },
          {
            pcSignedUri: dataSigned.getSignedImagesResolver.urlPC,
            vinSignedUri: dataSigned.getSignedImagesResolver.urlVin,
            tankSignedUri: dataSigned.getSignedImagesResolver.urlTank,
            platesSignedUri: dataSigned.getSignedImagesResolver.urlPlates,
            circulationSignedUri:
              dataSigned.getSignedImagesResolver.urlCirculation,
            videoSigned: dataSigned.getSignedImagesResolver.urlVideo,
          },
        );
        setPlatesSignedUri(null);
        setCirculationSignedUri(null);
        setTankSignedUri(false);
        setVideoSigned(false);
        setPcSignedUri(false);
        setVinSignedUri(false);
        setIsLoadingS3(false);
      }
    };
    if (data) {
      mutation.reset();
    }
    const buttonInfo = {
      style: { ...makeStyles.stylesButton, width: width * 0.9 },
      contentStyle: makeStyles.stylesButtonContent,
      buttonColor: "#1C9ADD",
      mode: "contained",
    };

    React.useEffect(() => {
      if (user && userProp) {
        setDataVariables({
          id: userProp._id,
          idGas: user.idGas,
        });
      }
    }, [user, userProp]);
    React.useEffect(() => {
      if (dataVariables) {
        refetch();
      }
    }, [dataVariables]);

    React.useEffect(() => {
      if (dataQuery && dataQuery.getInfoVehicleToEditResolver) {
        setDataVariablesSigned({
          _id: dataQuery.getInfoVehicleToEditResolver.idClient,
          serialNumber: dataQuery.getInfoVehicleToEditResolver.serialNumber,
          isUpdate: true,
        });
        const transformJson = JSON.stringify(dataFormRegisterAditional);
        const revertJson = JSON.parse(transformJson);
        const parsedData = dataQuery.getInfoVehicleToEditResolver;
        const getKeys = Object.keys(parsedData);
        for (let i = 0; i < revertJson.length; i++) {
          if (getKeys.includes(revertJson[i].name)) {
            revertJson[i].value = String(parsedData[revertJson[i].name]);
          }
        }
        setParsedJson(revertJson);
        setEmergencyActivations(
          dataQuery.getInfoVehicleToEditResolver.vehicleEmergencyActivations,
        );
        if (
          dataQuery.getInfoVehicleToEditResolver.numberOfMonthsContract !=
          "null"
        ) {
          setEndDateContract(
            dataQuery.getInfoVehicleToEditResolver.numberOfMonthsContract,
          );
        }

        setIsSwitchOn(dataQuery.getInfoVehicleToEditResolver.isNaturalGas);
        setTotalPrice(dataQuery.getInfoVehicleToEditResolver.totalPrice);
        setAutomaticPay(dataQuery.getInfoVehicleToEditResolver.finalDateToPay);
        setWithMileage(dataQuery.getInfoVehicleToEditResolver.withMileage);
        setAllGas(dataQuery.getInfoVehicleToEditResolver.allGas);
        const parsedTimeOff = dataQuery.getInfoVehicleToEditResolver.timeOff;
        const arrayTimeOff = [];
        for (let i = 0; i < parsedTimeOff.length; i++) {
          arrayTimeOff.push(Number(parsedTimeOff[i]));
        }
        setTimeOff(arrayTimeOff);
      }
    }, [dataQuery]);

    const [timeOff, setTimeOff] = React.useState<any>([]);
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
      if (timeOff.includes(0)) {
        setSunday(true);
      }
      if (timeOff.includes(6)) {
        setSaturday(true);
      }
    }, [timeOff]);

    React.useEffect(() => {
      if (dataVariablesSigned._id) {
        refetchSigned();
      }
    }, [dataVariablesSigned]);

    if (isFetching || isLoading) {
      return (
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#1C9ADD" />
          <Text style={localStyles.loadingText}>Cargando datos...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={localStyles.errorContainer}>
          <View style={localStyles.errorIconContainer}>
            <Icon name="server-off" size={48} color="#E53935" />
          </View>
          <Text style={localStyles.errorTitle}>Error de servidor</Text>
          <Text style={localStyles.errorText}>
            No se pudo cargar la información.{"\n"}Intenta de nuevo más tarde.
          </Text>
        </View>
      );
    }
    return (
      <>
        {parsedJson ? (
          <KeyboardAwareScrollView style={{ flex: 1 }}>
            <View style={{ display: isRegisterImages ? "flex" : "none" }}>
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
                display: isGeneratedServices ? "flex" : "none",
              }}
            >
              <CreateEditServices
                newCredit={newCredit}
                setNewCredit={setNewCredit}
                endDateContract={endDateContract}
                setEndDateContract={setEndDateContract}
                allGas={allGas}
                onAllGas={setAllGas}
                emergencyActivations={emergencyActivations}
                setEmergencyActivations={setEmergencyActivations}
                automaticPay={automaticPay}
                setAutomaticPay={setAutomaticPay}
                totalPrice={totalPrice}
                setTotalPrice={setTotalPrice}
                saturday={saturday}
                sunday={sunday}
                onSaturday={onSaturday}
                onSunday={onSunday}
                withMileage={withMileage}
                onWithMileage={onWithMileage}
                setIsGeneratedServices={setIsGeneratedServices}
                services={services}
                maintenances={maintenances}
                isSwitchOn={isSwitchOn}
                onToggleSwitch={onToggleSwitch}
                dataQuery={dataQuery}
              />
            </View>
            <View
              style={{
                display:
                  isGeneratedServices || isRegisterImages ? "none" : "flex",
                alignItems: "center",
              }}
            >
              <DynamicForm
                onSubmit={handleSubmit}
                isLoading={isLoading || isLoadingS3}
                json={parsedJson}
                labelSubmit="Solicitar Actualizacion"
                buttonProps={buttonInfo}
              >
                {/* Generar Servicios Button - Green */}
                <TouchableOpacity
                  style={localStyles.actionButton}
                  onPress={() => setIsGeneratedServices(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    style={localStyles.actionButtonGradient}
                    colors={["#4CAF50", "#388E3C"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="cog-outline" size={20} color="#FFFFFF" />
                    <Text style={localStyles.actionButtonText}>
                      Generar Servicios
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Actualizar Imagenes Button - Orange */}
                {dataSigned && (
                  <TouchableOpacity
                    style={localStyles.actionButton}
                    onPress={() => setIsRegisterImages(true)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      style={localStyles.actionButtonGradient}
                      colors={["#FF9800", "#F57C00"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Icon name="image-multiple" size={20} color="#FFFFFF" />
                      <Text style={localStyles.actionButtonText}>
                        Actualizar Imágenes
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* Cancelar Button - Red */}
                <TouchableOpacity
                  style={localStyles.cancelButton}
                  onPress={() => {
                    dispatch(handlerFormRegisterAction(false));
                    navigation.navigate("Dashboard", {});
                  }}
                  activeOpacity={0.8}
                >
                  <Icon name="close" size={20} color="#E53935" />
                  <Text style={localStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </DynamicForm>

              <Text style={makeStylesFormRegisterActivation.textCondition}>
                *Los campos con el asterisco, son obligatorios.
              </Text>
            </View>
          </KeyboardAwareScrollView>
        ) : null}
      </>
    );
  },
);

const localStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E53935",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  actionButton: {
    width: width * 0.85,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.85,
    backgroundColor: "#FFEBEE",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
    gap: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E53935",
  },
});

export default VehicleForm;
