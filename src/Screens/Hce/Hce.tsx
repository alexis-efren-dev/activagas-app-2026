/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { CommonActions } from "@react-navigation/native";
import React, { useState, useCallback, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import useDataLayer from "../../hooks/useDataLayer";

import { getAlertSuccess } from "../../redux/states/alertsReducerState";
import { handlerHceSessionAction } from "../../redux/states/handlerHceSessionSlice";
import { handlerNfcMaintenanceAction } from "../../redux/states/handlerNfcMaintenanceSlice";
import { getKey } from "../../redux/states/keySlice";
import { IStore } from "../../redux/store";
import { useMutationRegisterEmergencyActivations } from "../../services/Activation/useMutationRegisteremergencyActivations";
import { useMutationRegisterGasRefills } from "../../services/Activation/useMutationRegisterGasRefills";
import { useMutationRegisterIncompleteKey } from "../../services/Activation/useMutationRegisterIncompleteKey";
import { useMutationUpdateFirstEmergency } from "../../services/Activation/useMutationUpdateFirstEmergency";
import { useMutationUpdateVin } from "../../services/Maintenance/useMutationUpdateVin";

interface IProps {
  route: any;
  navigation: any;
}
const { height, width } = Dimensions.get("screen");

const App: React.FC<IProps> = ({ route, navigation }) => {
  const { mutate: mutateVin } = useMutationUpdateVin();
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations
  );
  const [handlerClosure, setHandlerClosure] = useState(false);
  const {
    controllerTime,
    routeRefresh,
    key,
    path,
    isPredefinedContent,
    user,
    serial,
    variables,
  } = route.params;
  console.log("la key", key);
  const scrollY: any = React.useRef(new Animated.Value(0)).current;
  const {
    mutate: mutateInitialActivation,
    isPending: isLoadingInitialActivation,
  } = useMutationUpdateFirstEmergency();
  const {
    mutate: mutateEmergencyActivation,
    isPending: isLoadingEmergencyActivation,
  } = useMutationRegisterEmergencyActivations();
  const { mutate: mutateIncompleteKey, isPaused: isLoadingIncompleteKey } =
    useMutationRegisterIncompleteKey();
  const { mutate: mutateGasRefills, isPending: isLoadingGasRefills } =
    useMutationRegisterGasRefills();
  const [controllerRead, setControllerRead] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>("");

  // Refs to access latest values in memoized callbacks
  const updatePropRef = useRef<any>(null);
  const mutateGasRefillsRef = useRef<any>(null);
  const mutateEmergencyActivationRef = useRef<any>(null);
  const mutateIncompleteKeyRef = useRef<any>(null);
  const mutateInitialActivationRef = useRef<any>(null);
  const mutateVinRef = useRef<any>(null);

  const handlerErrorAlert = useCallback((message: string) => {
    if (serial && updatePropRef.current) {
      updatePropRef.current("writable", true);
      updatePropRef.current("content", "");
    }
    dispatch(
      getAlertSuccess({
        message: "",
        show: false,
        messageError: message,
        showError: true,
      })
    );
    setHandlerClosure(true);
  }, [serial, dispatch]);

  const terminateWriteCallback = useCallback((data: any) => {
    if (data !== "") {
      if (data === "ACK") {
        if (serial && updatePropRef.current) {
          updatePropRef.current("writable", true);
          updatePropRef.current("content", "");
        }

        if (path === "activationvalidation" && mutateGasRefillsRef.current) {
          mutateGasRefillsRef.current(variables);
        } else if (path === "emergency" && mutateEmergencyActivationRef.current) {
          mutateEmergencyActivationRef.current(variables);
        } else if (path === "incompleteClient" && mutateIncompleteKeyRef.current) {
          mutateIncompleteKeyRef.current(variables);
        } else if (path === "initialActivation" && mutateInitialActivationRef.current) {
          mutateInitialActivationRef.current(variables);
        } else {
          dispatch(
            getAlertSuccess({
              message: "Activacion Exitosa",
              show: true,
              messageError: "",
              showError: false,
            })
          );
        }

        setHandlerClosure(true);
      } else if (data === "NACK") {
        handlerErrorAlert("Error de activacion, error al enviar datos");
      } else if (data === "E00") {
        handlerErrorAlert("Error de activacion, dispositivo no encontrado");
      } else if (data === "E01") {
        handlerErrorAlert("Error de activacion, vin no coincide");
      } else if (data === "E02") {
        handlerErrorAlert(
          "Error de activacion, computadora de gas no encontrada"
        );
      } else if (data === "E03") {
        handlerErrorAlert("Error de activacion, computadora de gas incorrecta");
      } else if (serial && data.length > 7) {
        if (updatePropRef.current) {
          updatePropRef.current("writable", true);
          updatePropRef.current("content", "");
        }
        if (mutateVinRef.current) {
          mutateVinRef.current({
            idGas: user.idGas,
            idMaintenance: user._id,
            serialNumber: serial,
            newVin: data,
          });
        }

        dispatch(handlerNfcMaintenanceAction("NFC"));
        dispatch(
          getAlertSuccess({
            message: "Confirmacion exitosa",
            show: true,
            messageError: "",
            showError: false,
          })
        );
        setHandlerClosure(true);
      }
    }
  }, [serial, path, variables, user, dispatch, handlerErrorAlert]);

  const terminateCallback = useCallback(() => {
    if (updatePropRef.current) {
      updatePropRef.current("writable", true);
    }
  }, []);

  const { switchSession, updateProp } = useDataLayer({
    terminate: terminateCallback,
    terminateWrite: terminateWriteCallback,
  });

  // Keep refs updated with latest values
  updatePropRef.current = updateProp;
  mutateGasRefillsRef.current = mutateGasRefills;
  mutateEmergencyActivationRef.current = mutateEmergencyActivation;
  mutateIncompleteKeyRef.current = mutateIncompleteKey;
  mutateInitialActivationRef.current = mutateInitialActivation;
  mutateVinRef.current = mutateVin;

  const initAnimation = () => {
    Animated.timing(scrollY, {
      toValue: height,
      useNativeDriver: true,
      duration: controllerTime,
    }).start(() => {
      //switchSession(false);
      updateProp("writable", true);
      updateProp("content", "");

      setHandlerClosure(true);
    });
  };
  const awaitResetSession = async () => {
    await switchSession(false);
  };
  React.useEffect(() => {
    //test alerts with this
    /*
    const fname = () => {
      clearInterval(refreshIntervalId);
      terminateWrite('ACK');
    };
    let refreshIntervalId: any = setInterval(fname, 6000);
    */

    if (key) {
      switchSession(true).then(() => {
        setContent(key);
      });
    }
  }, []);
  React.useEffect(() => {
    if (isPredefinedContent) {
      switchSession(true);
      setContent(isPredefinedContent);
    }
  }, [isPredefinedContent]);
  React.useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: "none", backgroundColor: "red" },
    });
  }, [JSON.stringify(navigation), JSON.stringify(route)]);

  React.useEffect(() => {
    if (
      handlerClosure &&
      !isLoadingGasRefills &&
      !isLoadingEmergencyActivation &&
      !isLoadingIncompleteKey &&
      !isLoadingInitialActivation
    ) {
      setContent("");
      updateProp("content", "");
      awaitResetSession().finally(() => {
        dispatch(getKey({ key: "" }));
        setControllerRead(false);
        scrollY.setValue(0);
        if (path === "emergency") {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "ActivatorActivations" }],
            })
          );
        } else if (path === "incompleteClient") {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "ActivatorActivations" }],
            })
          );
        } else if (path === "activationvalidation") {
          dispatch(handlerHceSessionAction(true));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "ActivatorActivations" }],
            })
          );
        } else {
          dispatch(handlerHceSessionAction(true));
          navigation.navigate(routeRefresh, { refreshRoute: true });
        }
      });
    }
  }, [
    handlerClosure,
    isLoadingGasRefills,
    isLoadingEmergencyActivation,
    isLoadingIncompleteKey,
    isLoadingInitialActivation,
  ]);

  React.useEffect(() => {
    if (controllerRead && content !== "") {
      updateProp("content", content);
      updateProp("writable", true);
      initAnimation();
    }
  }, [controllerRead, content]);
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={generalConfigurations.gradients}
    >
      <Animated.Image
        source={{
          uri: generalConfigurations.imageUrl,
        }}
        resizeMode="contain"
        style={{
          zIndex: 9999999999,
          height: height / 5,
          width: width * 0.9,
          top: height / 2,
          transform: [
            {
              rotate: scrollY.interpolate({
                inputRange: [0, height],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      />
      <Animated.View
        ref={scrollY}
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: generalConfigurations.gradients[0],
            transform: [{ translateY: scrollY }],
          },
        ]}
      />
    </LinearGradient>
  );
};

export default App;
