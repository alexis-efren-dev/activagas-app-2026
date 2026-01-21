/* eslint-disable react-hooks/exhaustive-deps */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AppState} from 'react-native';
import 'react-native-gesture-handler';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
import {useNfcValidation} from '../hooks/useNfcValidation';
import RouterClient from '../routes/RouterClient/Router';
import DashboardClient from '../Screens/Client/Dashboard/DashboardClient';
import UpdateProfile from '../Screens/Client/Profile/UpdateProfile';
import Support from '../Screens/Client/Support/Support';
import ScannerScreenHce from '../Screens/Hce/Hce';
import Logout from '../Screens/Logout/Logout';
import RegisterActivation from './RoutesActivatorRegister/Router';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TabNaviNAvi: React.FC = (): JSX.Element => {
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
        name="Dashboard"
        component={DashboardClient}
        options={{
          tabBarIcon: () => TabBarIcon('home-outline'),
        }}
      />
      <Tab.Screen
        name="Support"
        component={Support}
        options={{
          tabBarIcon: () => TabBarIcon('chat-outline'),
        }}
      />
      <Tab.Screen
        name="Dashboard2"
        component={Logout}
        options={{
          tabBarIcon: () => TabBarIcon('logout'),
        }}
      />
      <Tab.Screen
        name="Home"
        component={RouterClient}
        options={{tabBarItemStyle: {display: 'none'}, headerShown: false}}
      />
      <Tab.Screen
        name="HomeIncomplete"
        component={RouterClient}
        options={{tabBarItemStyle: {display: 'none'}, headerShown: false}}
      />
      <Tab.Screen
        name="HomeVehicle"
        component={RouterClient}
        options={{tabBarItemStyle: {display: 'none'}, headerShown: false}}
      />
      <Tab.Screen
        name="RegisterActivation"
        component={RegisterActivation}
        options={{tabBarItemStyle: {display: 'none'}, headerShown: false}}
      />
      <Tab.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{tabBarItemStyle: {display: 'none'}, headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const RoutesClient: React.FC = (): JSX.Element => {
  const {handlerNfc} = useNfcValidation();
  React.useEffect(() => {
    handlerNfc();
    AppState.addEventListener('focus', () => {
      handlerNfc();
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ActivatorActivations" component={TabNaviNAvi} />
        <Stack.Screen
          name="ScannerScreenHce"
          component={ScannerScreenHce}
          options={{}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RoutesClient;
