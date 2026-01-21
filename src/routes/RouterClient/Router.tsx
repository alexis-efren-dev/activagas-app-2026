import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import GetVehicles from '../../Screens/Accounting/GetVehicles/GetVehicles';
import Dashboard from '../../Screens/Client/Dashboard/Dashboard';
import EmergencyDashboard from '../../Screens/Client/EmergencyDashboard/EmergencyDashboard';
import IncompleteDashboard from '../../Screens/Client/IncompleteDashboard/IncompleteDashboard';
import UseEmergency from '../../Screens/Client/UseEmergency/UseEmergency';
import UpdateVehicles from '../../Screens/Client/Vehicles/UpdateVehicle';
import WriteNfcScreen from '../../Screens/Hce/Hce';
const Stack = createStackNavigator();

const RoutesNoAuth: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="EmergencyDashboard" component={EmergencyDashboard} />
      <Stack.Screen
        name="IncompleteDashboard"
        component={IncompleteDashboard}
      />
      <Stack.Screen name="UpdateVehicles" component={UpdateVehicles} />

      <Stack.Screen name="useemergencyactivation" component={UseEmergency} />
      <Stack.Screen name="GetVehicles" component={GetVehicles} />
      <Stack.Screen name="WriteScreen" component={WriteNfcScreen} />
    </Stack.Navigator>
  );
};
export default RoutesNoAuth;
