import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
import Logout from '../Screens/Logout/Logout';
import ScannerDevice from '../Screens/ScannerDevice/ScannerDevice';
const Tab = createBottomTabNavigator();
const RoutesGasera = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            height: 100,
          },
        })}>
        <Tab.Screen
          name="Dashboard"
          component={ScannerDevice}
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
export default RoutesGasera;
