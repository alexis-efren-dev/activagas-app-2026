import React, {useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import FormRegisterActivation from '../../../Components/RegisterActivation/FormRegisterActivation';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

interface IPropsRegisterActivation {
  navigation: any;
  route: any;
}

const RegisterActivation: React.FC<IPropsRegisterActivation> = ({
  navigation,
  route,
}): JSX.Element => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [controllerRender, setControllerRender] = React.useState<any>(false);
  const [controllerForm, setControllerForm] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        setControllerQuery(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  if (controllerForm && controllerRender) {
    return (
      <FormRegisterActivation
        serialNumber={controllerForm}
        navigation={navigation}
      />
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="cellphone-nfc" size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Registro de Dispositivo</Text>
          <Text style={styles.headerSubtitle}>
            Selecciona el número de serie para continuar
          </Text>
        </View>

        {/* Badge */}
        <View style={styles.badge}>
          <Icon name="account-plus" size={16} color="#4CAF50" />
          <Text style={styles.badgeText}>Primer Registro</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Icon name="information" size={20} color="#1C9ADD" />
            <Text style={styles.infoCardTitle}>Instrucciones</Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Selecciona un número de serie de la lista
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Completa el formulario con los datos del cliente y vehículo
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Confirma el registro para activar el dispositivo
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.content}>
          <Animated.View
            style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate('GetSerialAccounting', {
                  controllerTime: false,
                  routeRefresh: 'Register',
                })
              }
              activeOpacity={0.8}>
              <LinearGradient
                style={styles.buttonGradient}
                colors={['#4CAF50', '#388E3C']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <Icon name="format-list-numbered" size={22} color="#FFFFFF" />
                <Text style={styles.buttonText}>Seleccionar N° de Serie</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('DashboardRegister')}
            activeOpacity={0.8}>
            <Icon name="close" size={20} color="#E53935" />
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C9ADD',
  },
  stepContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C9ADD',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: width * 0.7,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4CAF50',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: width * 0.7,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 16,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53935',
  },
});

export default RegisterActivation;
