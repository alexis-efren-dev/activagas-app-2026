import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import FormPay from '../../Screens/Accounting/FormPay/FormPay';
import ScannerScreen from '../../Screens/ScreensActivator/ScannerScreen/ScannerScreen';
import Dashboard from '../../Screens/Stock/Dashboard/Dashboard';
import VerifyPay from '../../Screens/Stock/VerifyPay/VerifyPay';
const Stack = createStackNavigator();

const RoutesNoAuth: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="VerifyPay" component={VerifyPay} />
      <Stack.Screen name="FormPay" component={FormPay} />
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
    </Stack.Navigator>
  );
};
export default RoutesNoAuth;
