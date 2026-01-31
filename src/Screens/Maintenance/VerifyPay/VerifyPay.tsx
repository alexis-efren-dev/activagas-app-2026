import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserInfo from '../../../Components/Maintenance/UserInfo';

const VerifyPay = (props: any) => {
  const [user, setUser] = React.useState<any>(false);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setUser(props.route.params.item);
    } else if (props?.route?.params) {
      setUser('');
    }
  }, [props]);

  if (user === false) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator animating={true} color="#FF9800" size="large" />
          </View>
          <Text style={styles.loadingText}>Verificando informacion...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (user === '') {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Icon name="alert-circle" size={48} color="#E53935" />
        </View>
        <Text style={styles.errorTitle}>Error de servidor</Text>
        <Text style={styles.errorText}>
          No se pudo cargar la informacion del usuario.{'\n'}Por favor,
          intentalo mas tarde.
        </Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => props.navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color="#FF9800" />
          <Text style={styles.errorButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <UserInfo user={user} navigation={props.navigation} />;
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
    marginBottom: 24,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
});

export default VerifyPay;
