import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Platform, StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {TabBarIconModern} from '../Components/Shared/TabBarIcon/TabBarIcon';
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
          tabBarStyle: styles.tabBar,
        })}>
        <Tab.Screen
          name="Dashboard"
          component={ScannerDevice}
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
});

export default RoutesGasera;
