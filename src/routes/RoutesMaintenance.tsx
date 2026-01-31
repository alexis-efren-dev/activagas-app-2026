import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormPay from '../Screens/Accounting/FormPay/FormPay';
import {
  default as ScannerScreenHce,
  default as WriteNfcScreen,
} from '../Screens/Hce/Hce';
import Logout from '../Screens/Logout/Logout';
import GetVehicles from '../Screens/Maintenance/GetVehicles/GetVehicles';
import HomePlatesMaintenance from '../Screens/Maintenance/HomePlatesMaintenance/HomePlatesMaintenance';
import VerifyPay from '../Screens/Maintenance/VerifyPay/VerifyPay';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MAINTENANCE_COLOR = '#FF9800';
const MAINTENANCE_BG = '#FFF3E0';

interface TabBarIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabBarIconMaintenance: React.FC<TabBarIconProps> = ({
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
          color={focused ? MAINTENANCE_COLOR : '#8E8E93'}
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
      <Tab.Screen
        name="Home"
        component={HomePlatesMaintenance}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIconMaintenance
              focused={focused}
              icon="wrench"
              label="Inicio"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard2"
        component={Logout}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIconMaintenance
              focused={focused}
              icon="logout"
              label="Salir"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RoutesMaintenance: React.FC = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Dashboard" component={TabNaviNAvi} />
        <Stack.Screen name="VerifyPay" component={VerifyPay} />
        <Stack.Screen name="FormPay" component={FormPay} />
        <Stack.Screen name="GetVehicles" component={GetVehicles} />
        <Stack.Screen name="WriteScreen" component={WriteNfcScreen} />
        <Stack.Screen
          name="ScannerScreenHce"
          component={ScannerScreenHce}
          options={{}}
        />
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
    backgroundColor: MAINTENANCE_BG,
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
    color: MAINTENANCE_COLOR,
    fontWeight: '600',
  },
});

export default RoutesMaintenance;
