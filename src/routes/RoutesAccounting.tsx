import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Platform} from 'react-native';
import 'react-native-gesture-handler';
import {TabBarIconModern} from '../Components/Shared/TabBarIcon/TabBarIcon';
import RouterAccounting from '../routes/RoutesAccounting/Router';
import DashboardAccounting from '../Screens/Dashboard/DashboardAccounting';
import Logout from '../Screens/Logout/Logout';
import RegisterActivation from './RoutesActivatorRegister/Router';
import RoutesEdit from './RoutesEdit/RoutesEdit';

const Tab = createBottomTabNavigator();

const RoutesAccounting = () => {
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
          name="Dashboard"
          component={DashboardAccounting}
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

        <Tab.Screen
          name="Home"
          component={RouterAccounting}
          options={{
            headerShown: false,
            tabBarItemStyle: {display: 'none'},
          }}
        />
        <Tab.Screen
          name="RegisterActivation"
          component={RegisterActivation}
          options={{
            headerShown: false,
            tabBarItemStyle: {display: 'none'},
          }}
        />
        <Tab.Screen
          name="EditUser"
          component={RoutesEdit}
          options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RoutesAccounting;
