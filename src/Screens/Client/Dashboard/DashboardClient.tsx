import React, {useRef} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {IStore} from '../../../redux/store';
import {getAlertSuccess} from '../../../redux/states/alertsReducerState';
import {routesAction} from '../../../redux/states/routesSlice';

const {width} = Dimensions.get('screen');

interface IDashboardClient {
  navigation: StackNavigationProp<any, any>;
}

interface ActionButtonProps {
  icon: string;
  label: string;
  subtitle: string;
  colors: string[];
  onPress: () => void;
  delay?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  subtitle,
  colors,
  onPress,
  delay = 0,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
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
    const timeout = setTimeout(() => pulse.start(), delay);
    return () => {
      clearTimeout(timeout);
      pulse.stop();
    };
  }, [pulseAnim, fadeAnim, slideAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        {
          opacity: fadeAnim,
          transform: [{scale: pulseAnim}, {translateY: slideAnim}],
        },
      ]}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onPress}
        activeOpacity={0.85}>
        <LinearGradient
          style={styles.buttonGradient}
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.buttonIconContainer}>
            <Icon name={icon} size={32} color="#FFFFFF" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonLabel}>{label}</Text>
            <Text style={styles.buttonSubtitle}>{subtitle}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const DashboardClient: React.FC<IDashboardClient> = ({
  navigation,
}): JSX.Element => {
  const dispatch = useDispatch();
  const generalConfigurations = useSelector(
    (store: IStore) => store.generalConfigurations,
  );
  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);

  React.useEffect(() => {
    if (!enabled) {
      navigation.navigate('Dashboard');
    }
  }, [enabled, navigation]);

  const handleNfcRequired = (action: () => void) => {
    if (!enabled) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError:
            'Este módulo solo funciona con NFC. Verifica que tu dispositivo tiene esta tecnología y actívala.',
          showError: true,
        }),
      );
    } else {
      action();
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="account-circle" size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Mi Cuenta</Text>
          <Text style={styles.headerSubtitle}>
            Gestiona tus vehículos y activaciones
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.content}>
          <ActionButton
            icon="alarm-light"
            label="Activaciones Emergencia"
            subtitle="Usar activaciones de emergencia"
            colors={['#E91E63', '#C2185B']}
            onPress={() =>
              handleNfcRequired(() => {
                dispatch(routesAction('EmergencyDashboard'));
                navigation.navigate('Home');
              })
            }
            delay={0}
          />

          <ActionButton
            icon="clock-check"
            label="Completar Activación"
            subtitle="Finalizar activación pendiente"
            colors={['#4CAF50', '#388E3C']}
            onPress={() =>
              handleNfcRequired(() => {
                dispatch(routesAction('IncompleteDashboard'));
                navigation.navigate('HomeIncomplete');
              })
            }
            delay={100}
          />

          <ActionButton
            icon="account-edit"
            label="Mi Perfil"
            subtitle="Modificar datos personales"
            colors={['#1C9ADD', '#0D7ABC']}
            onPress={() => navigation.navigate('UpdateProfile')}
            delay={200}
          />

          <ActionButton
            icon="car-multiple"
            label="Mis Vehículos"
            subtitle="Ver y gestionar vehículos"
            colors={['#FF9800', '#F57C00']}
            onPress={() => {
              dispatch(routesAction('UpdateVehicles'));
              navigation.navigate('HomeVehicle');
            }}
            delay={300}
          />
        </View>

        {/* Footer Badge */}
        <View style={styles.footerBadge}>
          <Icon name="shield-account" size={16} color="#4CAF50" />
          <Text style={styles.footerBadgeText}>Portal de Cliente</Text>
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
    paddingBottom: 30,
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
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    width: width * 0.9,
    paddingTop: 10,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 30,
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

export default DashboardClient;
