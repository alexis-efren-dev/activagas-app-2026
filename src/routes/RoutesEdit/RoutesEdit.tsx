import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import DashboardEdit from '../../Screens/RoutesEdit/Dashboard';
import EnableVehicle from '../../Screens/RoutesEdit/EnableVehicle';
import EnableVehicleById from '../../Screens/RoutesEdit/EnableVehicleById';
import HandlerEdit from '../../Screens/RoutesEdit/HandlerEdit';
import UpdateUser from '../../Screens/RoutesEdit/UpdateUser';
import UpdateVehicle from '../../Screens/RoutesEdit/UpdateVehicle';
import UpdateVehicleById from '../../Screens/RoutesEdit/UpdateVehicleById';
const Stack = createStackNavigator();

const RoutesEdit: React.FC = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={DashboardEdit} />
      <Stack.Screen name="HandlerEdit" component={HandlerEdit}/>
      <Stack.Screen name="UpdateUser" component={UpdateUser}/>
      <Stack.Screen
        name="UpdateVehicle"
        component={UpdateVehicle}/>
      <Stack.Screen
        name="UpdateVehicleById"
        component={UpdateVehicleById}/>
      <Stack.Screen
        name="EnableVehicle"
        component={EnableVehicle}/>
      <Stack.Screen
        name="EnableVehicleById"
        component={EnableVehicleById}/>
    </Stack.Navigator>
  );
};
export default RoutesEdit;
