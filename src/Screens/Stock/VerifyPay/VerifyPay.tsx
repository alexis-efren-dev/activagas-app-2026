import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {IconButton, Title} from 'react-native-paper';
import AddSerial from '../../../Components/Stock/AddSerial';
import AddSerialNumber from '../../../Components/Stock/AddSerialNumber';
const VerifyPay = (props: any) => {
  const [user, setUser] = React.useState<any>(false);

  const [isValid, setIsValid] = React.useState<any>(false);
  React.useEffect(() => {
    if (props && isValid === false) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
          } else {
            setUser('');
          }
          if (props.route.params.serialNumber) {
            setIsValid(props.route.params.serialNumber);
          } else {
            setIsValid(false);
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
    <>
      {isValid ? (
        <AddSerialNumber
          user={user}
          navigation={props.navigation}
          serialNumber={isValid} />
      ) : (
        <AddSerial user={user} navigation={props.navigation} />
      )}
    </>
  );
};
export default VerifyPay;
