import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import Dashboard from '../../Screens/Verification/Dashboard/Dashboard';
import GetVehicles from '../../Screens/Verification/GetVehicles/GetVehicles';
import HomePlatesVerification from '../../Screens/Verification/HomePlatesVerification/HomePlatesVerification';
import VerifyUnit from '../../Screens/Verification/VerifyUnit/VerifyUnit';

const Stack = createStackNavigator();
const RoutesNoAuth: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen
        name="GetClientsToVerification"
        component={HomePlatesVerification}/>
      <Stack.Screen name="GetVehicles" component={GetVehicles} />
      <Stack.Screen name="VerifyUnit" component={VerifyUnit}/>
    </Stack.Navigator>
  );
};
export default RoutesNoAuth;
