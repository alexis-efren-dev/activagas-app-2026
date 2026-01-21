import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';

import LinearGradient from 'react-native-linear-gradient';
import {Button, IconButton, Title} from 'react-native-paper';
const {width, height} = Dimensions.get('screen');
const HandlerEdit = (props: any) => {
  const [user, setUser] = React.useState<any>(false);
  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);

  if (user === '') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton
          icon="water-boiler-alert"
          iconColor={'black'}
          size={80}
          onPress={() => props.navigation.goBack()}
        />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }

  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <View style={{marginTop: 35}}>
        <ResponsiveImage
          initHeight={height / 4}
          initWidth={width * 0.4}
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/useraccount.png',
          }}
        />
      </View>
      <View
        style={{
          width: width / 2.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
          USUARIO
        </Text>
      </View>

      <View style={{flex: 2}}>
        <Button
          style={{marginTop: 30, elevation: 5}}
          mode="contained"
          buttonColor="#1C9ADD"
          onPress={() =>
            props.navigation.navigate('UpdateUser', {
              user,
            })
          }>
          Editar Usuario
        </Button>
        <Button
          style={{elevation: 5, marginVertical: 30}}
          mode="contained"
          buttonColor="#1C9ADD"
          onPress={() =>
            props.navigation.navigate('UpdateVehicle', {
              item: user,
            })
          }>
          Editar Vehiculo
        </Button>
        <Button
          style={{elevation: 5}}
          mode="contained"
          buttonColor="#1C9ADD"
          onPress={() =>
            props.navigation.navigate('EnableVehicle', {
              item: user,
            })
          }>
          Habilitar/Deshabilitar Vehiculos
        </Button>
      </View>

      <View style={{width: width * 0.9}}>
        <IconButton
          icon="arrow-left-bold"
          iconColor="#1C9ADD"
          size={50}
          onPress={() => props.navigation.goBack()}
        />
      </View>
    </LinearGradient>
  );
};
export default HandlerEdit;
