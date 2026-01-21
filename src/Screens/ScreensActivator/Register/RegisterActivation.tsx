import React from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import FormRegisterActivation from '../../../Components/RegisterActivation/FormRegisterActivation';
import {IStore} from '../../../redux/store';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IPropsRegisterActivation {
  navigation: any;
  route: any;
}
const RegisterActivation: React.FC<IPropsRegisterActivation> = ({
  navigation,
  route,
}): JSX.Element => {
  const buttonStyles = {
    width: width / 1.5,
    backgroundColor: '#1C9ADD',
    marginBottom: 10,
    elevation: 2,
    borderRadius: height / (height * 0.2),
  };
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [controllerRender, setControllerRender] = React.useState<any>(false);
  const [controllerForm, setControllerForm] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);

  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        setControllerQuery(true);
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (route.params) {
      if (route.params.serialNumber && !controllerRender) {
        setControllerRender(true);
        setControllerForm(route.params.serialNumber);
      } else {
        setControllerRender(false);
        setControllerForm(false);
      }
    }
  }, [route]);
  return (
    <>
      {controllerForm && controllerRender ? (
        <FormRegisterActivation
          serialNumber={controllerForm}
          navigation={navigation}
        />
      ) : (
        <LinearGradient
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          colors={['#074169', '#019CDE', '#ffffff']}>
  <ScrollView>
                <View  style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1, marginTop: 30}}>
            <ResponsiveImage
              initHeight={height / 6}
              initWidth={width * 0.4}
              resizeMode="contain"
              source={{
                uri: 'https://activagas-files.s3.amazonaws.com/registerInitialIcon.png',
              }} />
          </View>
          <View
            style={{
              flex: 1,
              width: width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
              REGISTRO DE DISPOSITIVO
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              width: width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop:30,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 23,
                fontWeight: '500',
                backgroundColor: 'white',
              }}>
              IMPORTANTE
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              width: width * 0.8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop:30,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '600',
                elevation: 5,
              }}>
              Una vez escaneado, hacer click en “seleccionar nº de serie” para
              proceder con el registro
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop:30,
            }}>
            <Button
              onPress={() =>
                navigation.navigate('GetSerialAccounting', {
                  controllerTime: false,
                  routeRefresh: 'Register',
                })
              }
              textColor="#ffffff"
              style={buttonStyles}>
              SELECCIONAR N° DE SERIE
            </Button>
            <Button
              onPress={() => navigation.navigate('DashboardRegister')}
              textColor="#ffffff"
              style={buttonStyles}>
              CANCELAR
            </Button>
          </View>
                </View>
                </ScrollView>


        </LinearGradient>
      )}
    </>
  );
};
export default RegisterActivation;
