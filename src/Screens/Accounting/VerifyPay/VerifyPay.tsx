import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import UserInfo from '../../../Components/Accounting/UserInfo';

const VerifyPay = (props: any) => {
  const [user, setUser] = React.useState<any>(false);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setUser(props.route.params.item);
    } else {
      setUser('');
    }
  }, [props]);

  if (user === false) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color="red" />
      </View>
    );
  }

  if (user === '') {
    return (
      <View style={styles.errorContainer}>
        <IconButton icon="water-boiler-alert" iconColor="black" size={80} />
        <Title>Error de servidor, intentalo más tarde</Title>
      </View>
    );
  }

  return <UserInfo user={user} navigation={props.navigation} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VerifyPay;
