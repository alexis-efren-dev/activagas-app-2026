import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import FormPay from '../../Screens/Accounting/FormPay/FormPay';
import GetVehicles from '../../Screens/Accounting/GetVehicles/GetVehicles';
import HomePlates from '../../Screens/Accounting/HomePlates/HomePlates';
import VerifyPay from '../../Screens/Accounting/VerifyPay/VerifyPay';
import WriteNfcScreen from '../../Screens/Hce/Hce';
const Stack = createStackNavigator();

const RoutesNoAuth: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={HomePlates} />
      <Stack.Screen name="VerifyPay" component={VerifyPay} />
      <Stack.Screen name="FormPay" component={FormPay} />
      <Stack.Screen name="GetVehicles" component={GetVehicles} />
      <Stack.Screen name="WriteScreen" component={WriteNfcScreen} />
    </Stack.Navigator>
  );
};
export default RoutesNoAuth;
