import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Animated, Dimensions, LogBox } from "react-native";
import AlertError from "./Components/Alerts/AlertError";
import AlertSuccess from "./Components/Alerts/AlertSuccess";
import ErrorNfc from "./Screens/ErrorNfc/ErrorNfc";
import { useQueryGetValidDevice } from "./services/ValidDevice/useQueryGetValidDevice";
import RouterValidation from "./utils/routerValidation";
const { width } = Dimensions.get("screen");
const App: React.FC = (): JSX.Element => {
  const [idDevice, setIdDevice] = React.useState<any>(false);
  const { isError, refetch } = useQueryGetValidDevice({ idDevice });
  React.useEffect(() => {
    const getIdDevice = async () => {
      const localIdDevice = await AsyncStorage.getItem("deviceId");
      if (localIdDevice) {
        setIdDevice(localIdDevice);
      }
    };
    getIdDevice();
  }, []);
  const moveX = React.useRef<any>(new Animated.Value(-width)).current;

  React.useEffect(() => {
    Animated.timing(moveX, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (idDevice) {
      refetch();
    }
  }, [idDevice, refetch]);
  LogBox.ignoreAllLogs();

  if (idDevice === undefined || isError) {
    return <ErrorNfc />;
  }

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        transform: [{ translateX: moveX }],
      }}
    >
      <AlertError />
      <AlertSuccess />
      <RouterValidation />
    </Animated.View>
  );
};
export default App;
//
