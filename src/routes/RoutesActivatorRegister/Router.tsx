import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import GetPrevClients from '../../Components/RegisterActivation/GetPrevClients';
import RegisterPrevVehicle from '../../Components/RegisterActivation/RegisterPrevVehicle';
import GetSerialAccounting from '../../Screens/ScreensActivator/Accounting/GetSerialAccounting';
import DashboardRegister from '../../Screens/ScreensActivator/Register/DashboardRegister';
import Register from '../../Screens/ScreensActivator/Register/RegisterActivation';
import RegisterPrev from '../../Screens/ScreensActivator/Register/RegisterPrev';
import ScannerScreen from '../../Screens/ScreensActivator/ScannerScreen/ScannerScreen';
const Stack = createStackNavigator();
const RoutesNoAuth: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DashboardRegister" component={DashboardRegister} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterPrev" component={RegisterPrev} />
      <Stack.Screen name="GetPrevClients" component={GetPrevClients} />
      <Stack.Screen
        name="RegisterPrevVehicle"
        component={RegisterPrevVehicle}
      />
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
      <Stack.Screen
        name="GetSerialAccounting"
        component={GetSerialAccounting}/>
    </Stack.Navigator>
  );
};
export default RoutesNoAuth;
