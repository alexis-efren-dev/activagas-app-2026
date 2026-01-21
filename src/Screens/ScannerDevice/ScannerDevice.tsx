import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
import { Button, Card } from "react-native-paper";
import ResponsiveImage from "react-native-responsive-image";
import { useDispatch, useSelector } from "react-redux";
import { getAlertSuccess } from "../../redux/states/alertsReducerState";
import { IStore } from "../../redux/store";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const ScannerDevice = () => {
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations
  );

  const [deviceId, setDeviceId] = React.useState<any>("");
  const [deviceIdError, setDeviceIdError] = React.useState<boolean>(false);
  const [controllButon, setControllButon] = React.useState<number>(0);
  const dispatch = useDispatch();
  const verifyDevice = async () => {
    setControllButon(1);
    try {
      const cellPhoneId = (await DeviceInfo.getAndroidId()) || null;
      if (!cellPhoneId) {
        setDeviceIdError(true);
        dispatch(
          getAlertSuccess({
            messageError: "Error al obtener id",
            show: false,
            message: "",
            showError: true,
          })
        );
      } else {
        await AsyncStorage.setItem("deviceId", cellPhoneId);
        dispatch(
          getAlertSuccess({
            messageError: "",
            show: true,
            message:cellPhoneId,
            showError: false,
          })
        );
        // setDeviceId(cellPhoneId);
      }
    } catch (e) {
      setDeviceIdError(true);
    }
  };
  return (
    <LinearGradient
      style={{ flex: 1, alignItems: "center" }}
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
          marginBottom: 10,
          alignItems: "center",
          justifyContent: "center",
          height: height / 4,
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "bold" }}>
          Una vez escaneado, agrega este id al usuario para identificar los
          inicios de sesion
        </Text>
      </View>

      <View style={{ width, alignItems: "center" }}>
        <ResponsiveImage
          resizeMode="contain"
          initHeight={height / 4}
          initWidth={width * 0.9}
          source={{ uri: generalConfigurations.imageUrl }}
        />

        <Card.Actions style={{ justifyContent: "center" }}>
          <Button mode="contained" buttonColor="#1C9ADD" onPress={verifyDevice}>
            Escanear
          </Button>
        </Card.Actions>
      </View>
    </LinearGradient>
  );
};
export default ScannerDevice;
