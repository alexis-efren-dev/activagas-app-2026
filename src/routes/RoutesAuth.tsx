import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AppState, View, Text, StyleSheet, Platform} from 'react-native';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNfcValidation} from '../hooks/useNfcValidation';
import ErrorNfc from '../Screens/ErrorNfc/ErrorNfc';
import ScannerScreenHce from '../Screens/Hce/Hce';
import Logout from '../Screens/Logout/Logout';
import ActivatorActivations from '../Screens/ScreensActivator/Activation/Activation';
import ScannerScreen from '../Screens/ScreensActivator/ScannerScreen/ScannerScreen';
import WriteNfcScreen from '../Screens/ScreensActivator/WriteNfcScreen/WriteNfcScreen';
import RoutesDispatcher from './RoutesDispatcher/Router';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ACTIVATOR_COLOR = '#4CAF50';
const ACTIVATOR_BG = '#E8F5E9';

interface TabBarIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabBarIconActivator: React.FC<TabBarIconProps> = ({
  icon,
  label,
  focused,
}) => {
  return (
    <View style={styles.tabIconContainer}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
        <Icon
          name={icon}
          size={22}
          color={focused ? ACTIVATOR_COLOR : '#8E8E93'}
        />
      </View>
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        {label}
      </Text>
    </View>
  );
};

const TabNaviNAvi = () => {
  const {handlerNfc} = useNfcValidation();
  const [controllerNfc, setControllerNfc] = React.useState<boolean>(true);

  React.useEffect(() => {
    handlerNfc();
    AppState.addEventListener('focus', () => {
      handlerNfc();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
      {controllerNfc ? (
        <Tab.Screen
          name="Activation"
          component={ActivatorActivations}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIconActivator
                focused={focused}
                icon="home-outline"
                label="Inicio"
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Error"
          component={ErrorNfc}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIconActivator
                focused={focused}
                icon="alert-circle"
                label="Error"
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIconActivator
              focused={focused}
              icon="logout"
              label="Salir"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={RoutesDispatcher}
        options={{tabBarItemStyle: {display: 'none'}, headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const RoutesAuth: React.FC = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ActivatorActivations" component={TabNaviNAvi} />
        <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
        <Stack.Screen
          name="ScannerScreenHce"
          component={ScannerScreenHce}
          options={{}}
        />
        <Stack.Screen name="WriteScreen" component={WriteNfcScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconWrapper: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperFocused: {
    backgroundColor: ACTIVATOR_BG,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
    }),
  },
  labelFocused: {
    color: ACTIVATOR_COLOR,
    fontWeight: '600',
  },
});

export default RoutesAuth;
