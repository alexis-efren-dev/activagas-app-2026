import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FinalPay from '../../../Components/Accounting/FinalPay';
import { useEffect, useState } from 'react';

const FormPay = (props: any) => {
  const [user, setUser] = useState<any>(false);

  useEffect(() => {
    if (props?.route?.params?.user) {
      setUser(props.route.params.user);
    } else {
      setUser('');
    }
  }, [props]);

  if (user === false) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }

  if (user === '') {
    return (
      <View style={styles.errorContainer}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo más tarde</Title>
      </View>
    );
  }

  return <FinalPay user={user} navigation={props.navigation} />;
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

export default FormPay;
