import React, {useRef, useEffect} from 'react';
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
import GetPrevClients from '../../../Components/RegisterActivation/GetPrevClients';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

interface IPropsRegisterActivation {
  navigation: any;
  route: any;
}

const RegisterPrev: React.FC<IPropsRegisterActivation> = ({
  navigation,
  route,
}): JSX.Element => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [controllerRender, setControllerRender] = React.useState<any>(false);
  const [controllerForm, setControllerForm] = React.useState<any>(false);

  const user = useSelector((store: IStore) => store.loggedUser);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for main button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        setControllerQuery(true);
      }
    }
  }, [user]);

  useEffect(() => {
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

  if (controllerForm && controllerRender) {
    return (
      <GetPrevClients serialNumber={controllerForm} navigation={navigation} />
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.headerIconContainer}>
            <Icon name="cellphone-link" size={40} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Registro de Dispositivo</Text>
          <Text style={styles.headerSubtitle}>
            Vincula un nuevo dispositivo a un cliente existente
          </Text>
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoIconContainer}>
              <Icon name="information" size={22} color="#FF9800" />
            </View>
            <Text style={styles.infoCardTitle}>Importante</Text>
          </View>
          <Text style={styles.infoCardText}>
            Selecciona el número de serie del dispositivo y luego busca al
            cliente existente para vincular el nuevo equipo.
          </Text>
        </Animated.View>

        {/* Steps Card */}
        <Animated.View
          style={[
            styles.stepsCard,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.stepsTitle}>Pasos a seguir</Text>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Selecciona el número de serie</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, {backgroundColor: '#E8F5E9'}]}>
              <Text style={[styles.stepNumberText, {color: '#4CAF50'}]}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Busca y selecciona el cliente</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Animated.View style={{transform: [{scale: pulseAnim}]}}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate('GetSerialAccounting', {
                  controllerTime: false,
                  routeRefresh: 'RegisterPrev',
                })
              }
              activeOpacity={0.85}>
              <LinearGradient
                style={styles.primaryButtonGradient}
                colors={['#4CAF50', '#388E3C']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <View style={styles.buttonIconContainer}>
                  <Icon name="format-list-bulleted" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.primaryButtonText}>
                    Seleccionar N° de Serie
                  </Text>
                  <Text style={styles.primaryButtonSubtext}>
                    Ver dispositivos disponibles
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('DashboardRegister')}
            activeOpacity={0.8}>
            <Icon name="arrow-left" size={20} color="#666" />
            <Text style={styles.secondaryButtonText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Badge */}
        <View style={styles.footerBadge}>
          <Icon name="account-check" size={16} color="#1C9ADD" />
          <Text style={styles.footerBadgeText}>Cliente Existente</Text>
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
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
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
    fontWeight: '500',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    width: width * 0.9,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
  },
  infoCardText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '700',
    color: '#4CAF50',
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
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
  stepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C9ADD',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonsContainer: {
    width: width * 0.9,
    alignItems: 'center',
  },
  primaryButton: {
    width: width * 0.9,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
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
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  buttonTextContainer: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  primaryButtonSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
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
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 24,
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
  footerBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default RegisterPrev;
