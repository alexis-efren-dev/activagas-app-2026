import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
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
  }, [props, isValid]);

  if (user === false) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator animating={true} color="#1C9ADD" size="large" />
          </View>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (user === '') {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Icon name="server-off" size={48} color="#E53935" />
        </View>
        <Text style={styles.errorTitle}>Error de conexión</Text>
        <Text style={styles.errorText}>
          No se pudo conectar con el servidor.{'\n'}Por favor, inténtalo más
          tarde.
        </Text>
      </View>
    );
  }

  return (
    <>
      {isValid ? (
        <AddSerialNumber
          user={user}
          navigation={props.navigation}
          serialNumber={isValid}
        />
      ) : (
        <AddSerial user={user} navigation={props.navigation} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VerifyPay;
