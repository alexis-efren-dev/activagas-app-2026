/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  IDACCOUNTING,
  IDACTIVATORS,
  IDCLIENT,
  IDGASERA,
  IDMAINTENANCE,
  IDSERIAL,
  IDVERIFICATIONUNIT,
} from "../Catalogs/roles";
import useDataLayer from "../hooks/useDataLayer";

import RoutesAuth from "../routes/RoutesAuth";
import RoutesNoAuth from "../routes/RoutesNoAuth";
import { useQueryAuth } from "../services/Login/Auth";
import { useMutationRefreshTokenResolver } from "../services/Login/RefreshToken";
import { customTypeError } from "./customTypeError";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { activeSessionAction } from "../redux/states/activeSessionState";
import { getAlertSuccess } from "../redux/states/alertsReducerState";
import { setAuthToken } from "../redux/states/authTokenSlice";
import { intervalsRefAction } from "../redux/states/intervalsRefSlice";
import { loggedUserAction } from "../redux/states/loggedUserState";
import { IStore } from "../redux/store";
import RoutesAccounting from "../routes/RoutesAccounting";
import RoutesClient from "../routes/RoutesClient";
import RoutesGasera from "../routes/RoutesGasera";
import RoutesMaintenance from "../routes/RoutesMaintenance";
import RoutesStock from "../routes/RoutesStock";
import RoutesVerification from "../routes/RoutesVerification";
const RouterValidation = () => {
  const client = useQueryClient();
  const intervalRef: any = useRef<any>(null);
  const intervalRefTokenWork: any = useRef<any>(null);
  const intervalRefToken: any = useRef<any>(null);
  const { switchSession, updateProp } = useDataLayer({ terminate: () => {} });
  const dispatch = useDispatch();
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const activeSession = useSelector((store: IStore) => store.activeSession);
  const [token, setToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const { isLoading, refetch, data } = useQueryAuth(token);
  const {
    mutate,
    reset: resetMutation,
    data: dataMutation,
  } = useMutationRefreshTokenResolver();
  const [verifyId, setVerifyId] = useState<any>("");
  const [controllerId, setControllerId] = useState<any>(0);
  const saveInfoSession = async (dataSession: any) => {
    if (dataSession.verifyAuthResolver.idGas === "") {
      await AsyncStorage.setItem("look", dataSession.verifyAuthResolver._id);
    } else {
      await AsyncStorage.setItem("look", dataSession.verifyAuthResolver.idGas);
    }
  };
  const getAuthToken = async (): Promise<void> => {
    const getToken = await AsyncStorage.getItem("authToken");
    const getRefreshToken = await AsyncStorage.getItem("refreshToken");
    if (getToken && getRefreshToken) {
      AsyncStorage.setItem("authTokenUser", getToken);
      //AQUI PONER UN SLICE para manejar esa madre
      dispatch(setAuthToken(getToken));
      setToken(getToken);
      setRefreshToken(getRefreshToken);
      if (activeSession.active === "") {
        dispatch(activeSessionAction({ active: getToken }));
      }
    } else {
      setToken("");
      setVerifyId("");
    }
  };

  const awaitRefetch = async () => {
    try {
      const verifyData: any = await refetch();

      if (!verifyData.data) {
       
        if (verifyData.error.message.indexOf("Tus permisos") > -1) {
          dispatch(
            getAlertSuccess({
              message: "",
              show: false,
              messageError: customTypeError(verifyData.error),
              showError: true,
            })
          );
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("refreshToken");
          dispatch(activeSessionAction({ active: "" }));
          //TODO tener cuidado, por aqui aveces te elimina el deviceId del asyncstorage cuando se cierra la sesion
          return;
        }
        

        setIsExpiredToken(true);
      } else {
        //in this part, the token is valid, but with this, We're creating a timer with the seconds left until expiration

        if (verifyData.data.verifyAuthResolver.leavingWorkTime !== -360) {
          const fname2 = () => {
            clearInterval(intervalRefTokenWork.current);
            clearInterval(intervalRef.current);
            const dispatchErrors = (message: string) => {
              dispatch(
                getAlertSuccess({
                  message: "",
                  show: false,
                  messageError: message,
                  showError: true,
                })
              );
            };
            const deleteSession = async (): Promise<void> => {
              await AsyncStorage.removeItem("authToken");
              await AsyncStorage.removeItem("refreshToken");
              dispatch(activeSessionAction({ active: "" }));
            };
            dispatchErrors(
              customTypeError({
                response: {
                  errors: [{ message: "Tu horario de trabajo ha finalizado" }],
                },
              })
            );
            deleteSession();
          };

          intervalRef.current = setInterval(
            fname2,
            verifyData.data.verifyAuthResolver.leavingWorkTime * 1000 //timer executes after this seconds
          );

          const fname = () => {
            clearInterval(intervalRef.current);
            clearInterval(intervalRefTokenWork.current);
            setIsExpiredToken(true);
          };
          intervalRefTokenWork.current = setInterval(
            fname,
            (Number(jwtDecode(token).exp) - Math.floor(Date.now() / 1000)) *
              1000 //timer executes after this seconds
          );
          dispatch(
            intervalsRefAction({
              intervalWork: intervalRef.current,
              intervalTokenWithWork: intervalRefTokenWork.current,
            })
          );
        } else {
          const fname = () => {
            clearInterval(intervalRefToken.current);
            setIsExpiredToken(true);
          };
          intervalRefToken.current = setInterval(
            fname,
            (Number(jwtDecode(token).exp) - Math.floor(Date.now() / 1000)) *
              1000 //timer executes after this seconds
          );
          dispatch(
            intervalsRefAction({
              intervalToken: intervalRefToken.current,
            })
          );
        }

        setIsExpiredToken(false);
      }
    } catch (e) {
      setIsExpiredToken(true);
    }
  };

  useEffect(() => {
    setControllerId(0);
    getAuthToken();
  }, [activeSession]);

  useEffect(() => {
    if (token !== "") {
      client.removeQueries({ queryKey: ["auth"] });
      //remove();
      resetMutation();
      awaitRefetch();
    }
  }, [token]);
  useEffect(() => {
    if (data && controllerId === 0) {
      const copyData: any = { ...data };
      switchSession(true);
      updateProp("content", "init");
      setVerifyId(copyData.verifyAuthResolver.idRol);
      setControllerId(1);
      saveInfoSession(data);
      dispatch(
        loggedUserAction({
          _id: copyData.verifyAuthResolver._id,
          idRol: copyData.verifyAuthResolver.idRol,
          cellPhone: copyData.verifyAuthResolver.cellPhone,
          idGas: copyData.verifyAuthResolver.idGas,
        })
      );
    }
  }, [data]);

  useEffect(() => {
    if (isExpiredToken && refreshToken) {
      const decodeToken = jwtDecode<any>(token);
      mutate({
        idGas: decodeToken.idUser,
        refreshToken,
      });
    }
  }, [isExpiredToken, refreshToken]);

  useEffect(() => {
    if (dataMutation) {
      setIsExpiredToken(false);
      getAuthToken();
    }
  }, [dataMutation]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} color={"red"} />
      </View>
    );
  }
  if (activeSession.active === "") {
    return <RoutesNoAuth />;
  }
  if (verifyId == IDGASERA) {
    return <RoutesGasera />;
  }
  if (verifyId == IDACTIVATORS) {
    return <RoutesAuth />;
  }
  if (verifyId == IDACCOUNTING) {
    return <RoutesAccounting />;
  }
  if (verifyId == IDVERIFICATIONUNIT) {
    return <RoutesVerification />;
  }
  if (verifyId == IDMAINTENANCE) {
    return <RoutesMaintenance />;
  }
  if (verifyId == IDSERIAL) {
    return <RoutesStock />;
  }
  if (verifyId == IDCLIENT) {
    return <RoutesClient />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} color={"red"} />
    </View>
  );
};
export default RouterValidation;
