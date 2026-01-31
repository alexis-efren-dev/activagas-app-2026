import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import ResponsiveImage from 'react-native-responsive-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';

const {width, height} = Dimensions.get('screen');

const ScannerDevice = () => {
  const [isScanning, setIsScanning] = React.useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const dispatch = useDispatch();

  // Pulse animation for the scan button
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

  const verifyDevice = async () => {
    setIsScanning(true);
    try {
      const cellPhoneId = (await DeviceInfo.getAndroidId()) || null;
      if (!cellPhoneId) {
        dispatch(
          getAlertSuccess({
            messageError: 'No se pudo obtener el ID del dispositivo',
            show: false,
            message: '',
            showError: true,
          }),
        );
      } else {
        await AsyncStorage.setItem('deviceId', cellPhoneId);
        dispatch(
          getAlertSuccess({
            messageError: '',
            show: true,
            message: cellPhoneId,
            showError: false,
          }),
        );
      }
    } catch (e) {
      dispatch(
        getAlertSuccess({
          messageError: 'Error al escanear dispositivo',
          show: false,
          message: '',
          showError: true,
        }),
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      {/* Header con logo */}
      <View style={styles.header}>
        <ResponsiveImage
          resizeMode="contain"
          initHeight={height * 0.08}
          initWidth={width * 0.6}
          source={{
            uri: 'https://activagas-files.s3.amazonaws.com/activawithout.png',
          }}
        />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Card de información */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <Icon name="cellphone-check" size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.infoTitle}>Registro de Dispositivo</Text>
          <Text style={styles.infoText}>
            Escanea tu dispositivo para obtener el ID único. Este identificador
            se utilizará para validar los inicios de sesión en el sistema.
          </Text>
        </View>

        {/* Botón de escanear */}
        <Animated.View
          style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={verifyDevice}
            disabled={isScanning}
            activeOpacity={0.8}>
            <LinearGradient
              style={styles.buttonGradient}
              colors={isScanning ? ['#666', '#888'] : ['#1C9ADD', '#0D7ABC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Icon
                name={isScanning ? 'loading' : 'qrcode-scan'}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                {isScanning ? 'Escaneando...' : 'Escanear Dispositivo'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Indicador de seguridad */}
        <View style={styles.securityBadge}>
          <Icon name="shield-check" size={16} color="#4CAF50" />
          <Text style={styles.securityText}>Conexión segura</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
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
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  scanButton: {
    width: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1C9ADD',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    gap: 6,
  },
  securityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ScannerDevice;
