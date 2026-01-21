import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {IconButton, Title} from 'react-native-paper';
import GetPrevServices from './GetPrevServices';
const RegisterPrevVehicle = (props: any) => {
  const [user, setUser] = React.useState<any>(false);
  const [serialNumber, setSerialNumber] = React.useState<any>(false);
  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
            setSerialNumber(props.route.params.serialNumber);
          } else {
            setUser('');
            setSerialNumber('');
          }
        }
      }
    }
  }, [props]);
  if (user === false) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (user === '') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }

  return (
    <GetPrevServices
      userSelected={user}
      navigation={props.navigation}
      serialNumber={serialNumber} />
  );
};
export default RegisterPrevVehicle;
