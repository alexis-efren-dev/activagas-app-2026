/* eslint-disable react-hooks/exhaustive-deps */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {AppState, Platform, StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {TabBarIconModern} from '../Components/Shared/TabBarIcon/TabBarIcon';
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
          tabBarStyle: store.isOpen ? styles.tabBarHidden : styles.tabBar,
        })}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIconModern icon="home-outline" label="Inicio" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Dashboard2"
          component={Logout}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIconModern icon="logout" label="Salir" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarHidden: {
    height: 0,
    display: 'none',
  },
});

export default RoutesStock;
