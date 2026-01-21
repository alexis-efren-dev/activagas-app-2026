/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Linking, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import dataFormLogin from "../../DataForms/dataFormLogin.json";
import { activeSessionAction } from "../../redux/states/activeSessionState";
import { useMutationLogin } from "../../services/Login/Login";
import { DynamicForm } from "../DynamicForms/DynamicForm";
import { makeStyles } from "./customStyles/FormLogin";
import { IDataLogin } from "./types";
const { width } = Dimensions.get("screen");
const FormLogin: React.FC = React.memo((): JSX.Element => {
  const navigation: any = useNavigation();

  const dispatch = useDispatch();
  const mutation = useMutationLogin();
  const { data, isError, isPending: isLoading } = mutation;
  const handleSubmit = async (dataLogin: IDataLogin) => {
    const idDevice = await AsyncStorage.getItem("deviceId");
    mutation.mutate({
      cellPhone: Number(dataLogin.cellPhone),
      password: dataLogin.password,
      idDevice,
    });
  };
  React.useEffect(() => {
    if (data && !isError) {
      dispatch(activeSessionAction({ active: data.loginV2Resolver.token }));
    }
  }, [data, isError, dispatch]);
  const buttonInfo = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: "#1F97DC",
    mode: "contained",
  };
  return (
    <>
      <DynamicForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        json={dataFormLogin}
        labelSubmit="Entrar"
        buttonProps={buttonInfo}
      >
        <View
          style={{
            width: width * 0.9,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Text
            onPress={() => navigation.navigate("Recover")}
            style={{ color: "#1F97DC", fontSize: 15, fontWeight: "bold" }}
          >
            ¿Olvidaste tu contraseña?
          </Text>
          <Text
            onPress={async () => {
              await Linking.openURL("https://terms.activagas.com");
            }}
            style={{
              color: "#1F97DC",
              fontSize: 12,
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            Terminos y Condiciones
          </Text>
        </View>
      </DynamicForm>
    </>
  );
});
export default FormLogin;
