import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import Dashboard from '../../Screens/Accounting/Dashboard/Dashboard';
import GetVehicles from '../../Screens/Accounting/GetVehicles/GetVehicles';
import VerifyPay from '../../Screens/Accounting/VerifyPay/VerifyPay';
import EmergencyDashboard from '../../Screens/Client/EmergencyDashboard/EmergencyDashboard';
import IncompleteDashboard from '../../Screens/Client/IncompleteDashboard/IncompleteDashboard';
import UseEmergency from '../../Screens/Client/UseEmergency/UseEmergency';
import WriteNfcScreen from '../../Screens/Hce/Hce';
const Stack = createStackNavigator();

const RoutesDispatcher: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="VerifyPay" component={VerifyPay} />
      <Stack.Screen name="EmergencyDashboard" component={EmergencyDashboard} />
      <Stack.Screen
        name="IncompleteDashboard"
        component={IncompleteDashboard}
      />
      <Stack.Screen name="useemergencyactivation" component={UseEmergency} />
      <Stack.Screen name="GetVehicles" component={GetVehicles} />
      <Stack.Screen name="WriteScreen" component={WriteNfcScreen} />
    </Stack.Navigator>
  );
};
export default RoutesDispatcher;
