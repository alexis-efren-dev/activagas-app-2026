/* eslint-disable react-hooks/exhaustive-deps */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {AppState} from 'react-native';
import 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
import {useNfcValidation} from '../hooks/useNfcValidation';
import {IStore} from '../redux/store';
import Logout from '../Screens/Logout/Logout';
import Home from './RoutesStock/Router';
const Tab = createBottomTabNavigator();
const RoutesStock: React.FC = (): JSX.Element => {
  const {handlerNfc} = useNfcValidation();
  const store = useSelector((storeRedux: IStore) => storeRedux.keyboardState);

  React.useEffect(() => {
    handlerNfc();
    AppState.addEventListener('focus', () => {
      handlerNfc();
    });
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            height: store.isOpen ? 0 : 100,
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
export default RoutesStock;
