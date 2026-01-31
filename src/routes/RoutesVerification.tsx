import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Platform} from 'react-native';
import 'react-native-gesture-handler';
import {TabBarIconModern} from '../Components/Shared/TabBarIcon/TabBarIcon';
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
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: '#FFFFFF',
            height: Platform.OS === 'android' ? 65 : 85,
            paddingBottom: Platform.OS === 'android' ? 8 : 25,
            paddingTop: 8,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: -2},
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        })}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIconModern
                icon="home-outline"
                label="Inicio"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Dashboard2"
          component={Logout}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIconModern
                icon="logout"
                label="Salir"
                focused={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RoutesVerification;
