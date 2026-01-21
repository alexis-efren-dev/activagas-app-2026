

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
import Logout from '../Screens/Logout/Logout';
import Home from './RoutesVerification/Router';
const Tab = createBottomTabNavigator();
const RoutesVerification: React.FC = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard:true,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            height: 100,
          },
        })}>
        <Tab.Screen
          name="Home"
          component={Home}
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
    </NavigationContainer>
  );
};
export default RoutesVerification;
