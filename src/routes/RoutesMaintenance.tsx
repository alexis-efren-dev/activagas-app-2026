

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
import FormPay from '../Screens/Accounting/FormPay/FormPay';
import {
  default as ScannerScreenHce,
  default as WriteNfcScreen,
} from '../Screens/Hce/Hce';
import Logout from '../Screens/Logout/Logout';
import GetVehicles from '../Screens/Maintenance/GetVehicles/GetVehicles';
import HomePlatesMaintenance from '../Screens/Maintenance/HomePlatesMaintenance/HomePlatesMaintenance';
import VerifyPay from '../Screens/Maintenance/VerifyPay/VerifyPay';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNaviNAvi = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 100,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomePlatesMaintenance}
        options={{
          tabBarIcon: () => TabBarIcon('home-outline'),
        }}
      />
      <Tab.Screen
        name="Dashboard2"
        component={Logout}
        options={{
          tabBarIcon: () => TabBarIcon('logout'),
        }}
      />
    </Tab.Navigator>
  );
};

const RoutesMaintenance: React.FC = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Dashboard" component={TabNaviNAvi} />
        <Stack.Screen name="VerifyPay" component={VerifyPay} />
        <Stack.Screen name="FormPay" component={FormPay} />
        <Stack.Screen name="GetVehicles" component={GetVehicles} />
        <Stack.Screen name="WriteScreen" component={WriteNfcScreen} />
        <Stack.Screen
          name="ScannerScreenHce"
          component={ScannerScreenHce}
          options={{}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RoutesMaintenance;
