import {createStaticNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../Screens/Login';
import RecoverPassword from '../Screens/RecoverPassword/RecoverPassword';
import {RecoverCode} from '../Screens/RecoverCode/RecoverCode';
//import {Login} from '../Screens';
//import RecoverPassword from '../Screens/RecoverPassword/RecoverPassword';
//import {RecoverCode} from '../Screens/RecoverCode/RecoverCode';
const Stack = createStackNavigator({
  screenOptions: {headerShown: false},
  screens: {
    Login: Login,
    Recover: RecoverPassword,
    RecoverCode,
  },
});

const Navigation = createStaticNavigation(Stack);

export default Navigation;
