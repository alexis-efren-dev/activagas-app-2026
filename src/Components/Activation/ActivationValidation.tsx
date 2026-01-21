/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import { Avatar, Button, Card } from "react-native-paper";
import ResponsiveImage from "react-native-responsive-image";
import { useDispatch, useSelector } from "react-redux";
import dataFormLogin from "../../DataForms/dataFormValidate.json";
import useDataLayer from "../../hooks/useDataLayer";

import { getAlertSuccess } from "../../redux/states/alertsReducerState";
import { currentPlatesAction } from "../../redux/states/currentPlatesSlice";
import { dataBasicAction } from "../../redux/states/dataBasicSlice";
import { handlerHceSessionAction } from "../../redux/states/handlerHceSessionSlice";
import { routesAction } from "../../redux/states/routesSlice";
import { IStore } from "../../redux/store";
import { useMutationAlertResolver } from "../../services/Activation/useMutationAlertResolver";
import { useMutationGetBasicInformation } from "../../services/Activation/useMutationGetBasicInformation";
import { useMutationValidation } from "../../services/Activation/useMutationValidation";
import { useMutationCreateRelease } from "../../services/Release/create-release.service";
import { DynamicForm } from "../DynamicForms/DynamicForm";
import { makeStyles } from "../Login/customStyles/FormLogin";
interface IActivation {
  navigation: any;
  controllerTime: any;
  route: any;
}
const { height, width } = Dimensions.get("screen");

const ActivationValidation: React.FC<IActivation> = (props: any) => {
  const mutation = useMutationCreateRelease();
  const { data: dataRelease, reset: resetRelease } = mutation;
  const [variables, setVariables] = useState<any>();
  const [basicInformation, setBasicInformation] = useState<any>({});
  const [isVisibleBasicInformation, setIsVisibleBasicInformation] =
    useState<any>(false);
  const { navigation, controllerTime } = props;
  const dataRedux: any = useSelector((store: IStore) => store.dataBasic);
  const handlerHceSession = useSelector(
    (store: IStore) => store.handlerHceSession
  );
  const { switchSession, updateProp } = useDataLayer({
    terminateWrite: (data: string) => {
      if (
        data !== "" &&
        data !== "ACK" &&
        data !== "NACK" &&
        data !== "E00" &&
        data !== "E01" &&
        data !== "E02" &&
        data !== "E03"
      ) {
        setExtractPlates(["plates", data]);
        mutateBasic({
          idGas: user.idGas,
          idDispatcher: user._id,
          serialNumber: data,
        });
      }
    },
  });
  const [extractPlates, setExtractPlates] = useState<any>("");
  const dispatch = useDispatch();
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations
  );
  const [handlerInit, setHandlerInit] = useState(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);
  const alerts = useSelector((store: IStore) => store.alerts);
  const [controlAlert, setControlAlert] = useState(false);
  const { mutate: mutateBasic, reset: resetBasic } =
    useMutationGetBasicInformation();
  const {
    mutate: mutateAlert,
    isPending: isLoadingAlert,
    data: dataAlert,
    reset: resetAlert,
  } = useMutationAlertResolver();
  const { mutate, isPending: isLoading, reset } = useMutationValidation();
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
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: "#1C9ADD",
    mode: "contained",
  };
  const handleSubmit = (data: any) => {
    setControlAlert(false);

    if (
      data.liters === 0 ||
      data.liters === "" ||
      !data.liters ||
      data.liters === "0" ||
      isNaN(Number(data.liters)) ||
      Number(data.liters) < 0
    ) {
      dispatch(
        getAlertSuccess({
          message: "",
          show: false,
          messageError: "Ingresa litros validos",
          showError: true,
        })
      );
    } else if (isNaN(Number(data.mileage)) || Number(data.mileage) < 0) {
      dispatch(
        getAlertSuccess({
          message: "",
          show: false,
          messageError: "Ingresa Kilometraje valido",
          showError: true,
        })
      );
    } else if (data.plates.length < 4) {
      dispatch(
        getAlertSuccess({
          message: "",
          show: false,
          messageError: "Placas no validas, ingresar mas de 3 caracteres",
          showError: true,
        })
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
    if (keys.key !== "" && dataRelease?.createRelease) {
      reset();
      resetAlert();
      resetBasic();
      resetRelease();
      dispatch(dataBasicAction(false));
      navigation.navigate("ScannerScreenHce", {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: "ActivatorActivations",
        path: "activationvalidation",
        variables,
      });
    }
    if (keys.key !== "" && dataAlert?.getAlertToShowResolver === "null") {
      reset();
      resetAlert();
      resetBasic();
      dispatch(dataBasicAction(false));
      navigation.navigate("ScannerScreenHce", {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: "ActivatorActivations",
        path: "activationvalidation",
        variables,
      });
    } else if (
      keys.key !== "" &&
      dataAlert?.getAlertToShowResolver.length > 6
    ) {
      dispatch(
        getAlertSuccess({
          message: "",
          show: false,
          messageError: dataAlert.getAlertToShowResolver,
          showError: true,
        })
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
      navigation.navigate("ScannerScreenHce", {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: "ActivatorActivations",
        path: "activationvalidation",
        variables,
      });
    }
  }, [JSON.stringify(alerts)]);

  React.useEffect(() => {
    if (handlerInit) {
      if (handlerHceSession.isEnabled) {
        switchSession(true);
        updateProp("content", "init");
        updateProp("writable", true);
        //omit this for test
         setExtractPlates(["plates", ""]);
      } else {
        switchSession(false);
        updateProp("writable", false);
        updateProp("content", "");
      }
    }
  }, [JSON.stringify(handlerHceSession), handlerInit]);

  React.useEffect(() => {
    if (dataRedux.getVehicleBasicInformationResolver) {
      setExtractPlates([
        "plates",
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
    if (keys.key === "") {
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
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <LinearGradient
        style={{
          flex: 1,
          alignItems: "center",
          height: isVisibleBasicInformation ? "auto" : height,
        }}
        colors={["#074169", "#019CDE", "#ffffff"]}
      >
        <View
          style={{
            width,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
          }}
        >
          <ResponsiveImage
            resizeMode="contain"
            initHeight={height / 9}
            initWidth={width * 0.9}
            source={{
              uri: "https://activagas-files.s3.amazonaws.com/activawithout.png",
            }}
          />
        </View>

        <View
          style={{
            width: width / 1.5,
            marginBottom: 10,
            marginTop: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isVisibleBasicInformation && (
            <Text
              style={{ color: "#ffffff", fontSize: 15, fontWeight: "bold" }}
            >
              Agregar los litros de carga y haz clic en "Validar" para que
              validemos los datos
            </Text>
          )}
        </View>

        <View style={{ width, alignItems: "center" }}>
          <ResponsiveImage
            resizeMode="contain"
            initHeight={height / 4}
            initWidth={width * 0.9}
            source={{ uri: generalConfigurations.imageUrl }}
          />
        </View>
        {isVisibleBasicInformation ? (
          <>
            <DynamicForm
              setExtractData={extractPlates}
              onSubmit={handleSubmit}
              isLoading={isLoading || isLoadingAlert}
              json={dataFormLogin}
              labelSubmit="VALIDAR"
              buttonProps={buttonInfo}
            >
              {isVisibleBasicInformation && (
                <View
                  style={{
                    backgroundColor: "white",
                    width: width / 1.25,
                    borderRadius: (width * 0.7) / (height / 36),
                    elevation: 5,
                    marginBottom: 15,
                    marginTop: 10,
                    padding: 5,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 22,
                        marginBottom: 5,
                      }}
                    >
                      Informacion del vehiculo
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      Placas:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {basicInformation.plates}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      Modelo:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {basicInformation.model}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      Marca:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {basicInformation.brand}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      Cilindros:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {basicInformation.cylinders}
                    </Text>
                  </View>
                </View>
              )}
            </DynamicForm>

            <Button
              style={{ marginVertical: 30, elevation: 5, minWidth: "80%" }}
              mode="contained"
              buttonColor="#1C9ADD"
              onPress={() => {
                if (extractPlates[1] !== "") {
                  if (extractPlates[1] === "" || extractPlates[1].length < 2) {
                    dispatch(
                      getAlertSuccess({
                        message: "",
                        show: false,
                        messageError: "Escanear id",
                        showError: true,
                      })
                    );
                  } else {
                    setControlAlert(false);
                    reset();
                    resetAlert();
                    dispatch(routesAction("EmergencyDashboard"));
                    dispatch(currentPlatesAction(extractPlates[1]));
                    navigation.navigate("Home", { test: "test" });
                  }
                } else {
                  dispatch(
                    getAlertSuccess({
                      message: "",
                      show: false,
                      messageError: "Escanear id",
                      showError: true,
                    })
                  );
                }
              }}
            >
              ACTIVACIONES DE EMERGENCIA
            </Button>
            <Button
              style={{ elevation: 5, marginBottom: 30, minWidth: "80%" }}
              mode="contained"
              buttonColor="#1C9ADD"
              onPress={() => {
                if (extractPlates[1] !== "") {
                  if (extractPlates[1] === "" || extractPlates[1].length < 2) {
                    dispatch(
                      getAlertSuccess({
                        message: "",
                        show: false,
                        messageError: "Escanear id",
                        showError: true,
                      })
                    );
                  } else {
                    setControlAlert(false);
                    reset();
                    resetAlert();

                    dispatch(currentPlatesAction(extractPlates[1]));
                    dispatch(routesAction("IncompleteDashboard"));
                    navigation.navigate("Home", {});
                  }
                } else {
                  dispatch(
                    getAlertSuccess({
                      message: "",
                      show: false,
                      messageError: "Escanear id",
                      showError: true,
                    })
                  );
                }
              }}
            >
              COMPLETAR ACTIVACION
            </Button>
            <Button
              style={{ elevation: 5, width: "80%" }}
              mode="contained"
              buttonColor="#1C9ADD"
              onPress={() => {
                if (extractPlates[1] !== "") {
                  if (extractPlates[1] === "" || extractPlates[1].length < 2) {
                    dispatch(
                      getAlertSuccess({
                        message: "",
                        show: false,
                        messageError: "Escanear id",
                        showError: true,
                      })
                    );
                  } else {
                    mutation.mutate({
                      serialNumber: extractPlates[1],
                    });
                  }
                } else {
                  dispatch(
                    getAlertSuccess({
                      message: "",
                      show: false,
                      messageError: "Escanear id",
                      showError: true,
                    })
                  );
                }
              }}
            >
              Liberar
            </Button>
          </>
        ) : (
          <Card
            style={{
              borderStyle: "dotted",
              borderColor: "white",
              borderWidth: 3,
              width: width * 0.9,
              padding: 20,
              height: height / 3.5,
            }}
          >
            <Card.Title
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
              title="Escanear Dispositivo"
              subtitle="Para poder activar o realizar cualquier operacion debes escanear el id de este dispositivo."
              subtitleNumberOfLines={5}
              left={(propsAvatar) => (
                <Avatar.Icon
                  {...propsAvatar}
                  size={80}
                  icon="data-matrix-scan"
                  color="black"
                  style={{ backgroundColor: "transparent", left: -30 }}
                />
              )}
            />
          </Card>
        )}
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};
export default ActivationValidation;
