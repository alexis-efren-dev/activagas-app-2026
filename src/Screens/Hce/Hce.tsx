/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { CommonActions } from "@react-navigation/native";
import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const dispatch = useDispatch();
  const { mutate: mutateVin } = useMutationUpdateVin();
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations
  );

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

  // Animation
  const scrollY = useRef(new Animated.Value(0)).current;

  // State
  const [handlerClosure, setHandlerClosure] = useState(false);
  const [content, setContent] = useState<string>("");
  const [controllerRead, setControllerRead] = useState<boolean>(true);
  const hasStartedRef = useRef(false);

  // Mutations
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

  // Refs for callbacks
  const mutateGasRefillsRef = useRef<any>(null);
  const mutateEmergencyActivationRef = useRef<any>(null);
  const mutateIncompleteKeyRef = useRef<any>(null);
  const mutateInitialActivationRef = useRef<any>(null);
  const mutateVinRef = useRef<any>(null);
  const updatePropRef = useRef<any>(null);

  // Keep refs updated
  mutateGasRefillsRef.current = mutateGasRefills;
  mutateEmergencyActivationRef.current = mutateEmergencyActivation;
  mutateIncompleteKeyRef.current = mutateIncompleteKey;
  mutateInitialActivationRef.current = mutateInitialActivation;
  mutateVinRef.current = mutateVin;

  const isEncryptedKey = (data: string): boolean => {
    if (data.length > 50) return true;
    if (data.includes("+") || data.includes("/") || data.includes("=")) {
      return true;
    }
    return false;
  };

  const handleError = useCallback((message: string) => {
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

  const terminateWriteCallback = useCallback(
    (data: any) => {

      if (data === "" || data === "init") {
        return;
      }

      if (isEncryptedKey(data)) {
        return;
      }

      if (path === "releasedPath") {
        if (data === "ACK") {
          dispatch(
            getAlertSuccess({
              message: "Dispositivo liberado con exito",
              show: true,
              messageError: "",
              showError: false,
            })
          );
          setHandlerClosure(true);
          return;
        }

        if (/^\d{10,}$/.test(data)) {
          return;
        }

        dispatch(
          getAlertSuccess({
            message: "",
            show: false,
            messageError: "No se pudo liberar, intentalo mas tarde",
            showError: true,
          })
        );
        setHandlerClosure(true);
        return;
      }

      // Ignore serial numbers (they are read data, not responses)
      const validResponses = ["ACK", "NACK", "E00", "E01", "E02", "E03"];
      const isValidResponse = validResponses.includes(data);
      const isVinResponse = serial && data.length > 7 && data.length < 20;

      if (!isValidResponse && !isVinResponse) {
        return;
      }

      if (data === "ACK") {
        if (serial && updatePropRef.current) {
          updatePropRef.current("writable", true);
          updatePropRef.current("content", "");
        }

        if (path === "releasedPath") {
          // Liberacion: no se ejecuta ninguna mutation aqui
        } else if (path === "activationvalidation" && mutateGasRefillsRef.current) {
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
        handleError("Error de activacion, error al enviar datos");
      } else if (data === "E00") {
        handleError("Error de activacion, dispositivo no encontrado");
      } else if (data === "E01") {
        handleError("Error de activacion, vin no coincide");
      } else if (data === "E02") {
        handleError("Error de activacion, computadora de gas no encontrada");
      } else if (data === "E03") {
        handleError("Error de activacion, computadora de gas incorrecta");
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
    },
    [path, variables, user, serial, dispatch, handleError]
  );

  const { switchSession, updateProp } = useDataLayer({
    terminateWrite: terminateWriteCallback,
  });

  // Keep updateProp ref updated
  updatePropRef.current = updateProp;

  // Animation function
  const initAnimation = () => {
    Animated.timing(scrollY, {
      toValue: height,
      useNativeDriver: true,
      duration: controllerTime,
    }).start(() => {
      updateProp("writable", true);
      updateProp("content", "");
      setHandlerClosure(true);
    });
  };

  // Start HCE session on mount
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const keyToSend = key || isPredefinedContent;
    if (keyToSend) {
      switchSession(true).then(() => {
        setContent(keyToSend);
      });
    }
  }, []);

  // Set content and start animation
  useEffect(() => {
    if (controllerRead && content !== "") {
      updateProp("content", content);
      updateProp("writable", true);
      initAnimation();
    }
  }, [controllerRead, content]);

  // Handle navigation after completion
  useEffect(() => {
    if (
      handlerClosure &&
      !isLoadingGasRefills &&
      !isLoadingEmergencyActivation &&
      !isLoadingIncompleteKey &&
      !isLoadingInitialActivation
    ) {
      setContent("");
      updateProp("content", "");

      switchSession(false).then(() => {
        dispatch(getKey({ key: "" }));
        setControllerRead(false);
        scrollY.setValue(0);

        if (path === "emergency" || path === "incompleteClient" || path === "activationvalidation" || path === "releasedPath") {
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
