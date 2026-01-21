import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AppState} from 'react-native';
import 'react-native-gesture-handler';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
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
const TabNaviNAvi = () => {
  const {handlerNfc} = useNfcValidation();
  const [controllerNfc, setControllerNfc] = React.useState<boolean>(true);
  React.useEffect(() => {
    handlerNfc();
    AppState.addEventListener('focus', () => {
      handlerNfc();
    });
  }, []);
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
      {controllerNfc ? (
        <>
          <Tab.Screen
            name="Activation"
            component={ActivatorActivations}
            options={{
              tabBarIcon: () => TabBarIcon('home-outline'),
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="Error"
          component={ErrorNfc}
          options={{
            tabBarIcon: () => TabBarIcon('alert-circle'),
          }}
        />
      )}

      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarIcon: () => TabBarIcon('logout'),
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

const RoutesNoAuth: React.FC = (): JSX.Element => {
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

export default RoutesNoAuth;
