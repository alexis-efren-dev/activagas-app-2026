import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import TabBarIcon from '../Components/Shared/TabBarIcon/TabBarIcon';
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
            elevation: 0,
            height: 100,
          },
        })}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardAccounting}
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
