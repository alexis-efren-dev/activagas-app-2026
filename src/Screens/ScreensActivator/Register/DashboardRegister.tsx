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

const {width} = Dimensions.get('screen');

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

interface IProps {
  navigation: any;
}

const DashboardRegister: React.FC<IProps> = ({navigation}): JSX.Element => {
  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="account-plus" size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Registro</Text>
          <Text style={styles.headerSubtitle}>
            Registra un nuevo dispositivo o vehículo
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Icon name="information" size={20} color="#FF9800" />
            <Text style={styles.infoCardTitle}>Importante</Text>
          </View>
          <Text style={styles.infoCardText}>
            Si el cliente ya tiene equipo, selecciona{' '}
            <Text style={styles.highlight}>"Ya soy cliente"</Text>. De lo
            contrario, selecciona{' '}
            <Text style={styles.highlight}>"Primer registro"</Text> para
            creación inicial.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.content}>
          <ActionButton
            icon="account-plus-outline"
            label="Primer Registro"
            subtitle="Crear nuevo cliente y vehículo"
            colors={['#4CAF50', '#388E3C']}
            onPress={() => navigation.navigate('Register')}
            delay={0}
          />

          <ActionButton
            icon="account-check"
            label="Ya soy Cliente"
            subtitle="Agregar vehículo a cliente existente"
            colors={['#1C9ADD', '#0D7ABC']}
            onPress={() => navigation.navigate('RegisterPrev')}
            delay={100}
          />
        </View>

        {/* Footer Badge */}
        <View style={styles.footerBadge}>
          <Icon name="shield-check" size={16} color="#4CAF50" />
          <Text style={styles.footerBadgeText}>Módulo de Registro</Text>
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
    paddingBottom: 24,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    marginBottom: 24,
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
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
  },
  infoCardText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
    color: '#1C9ADD',
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
    marginTop: 20,
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

export default DashboardRegister;
