import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Clipboard,
  Animated,
  Modal,
} from 'react-native';
import {Portal, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

const AlertSuccess = () => {
  const dispatch = useDispatch();
  const {message, show} = useSelector((data: IStore) => data.alerts);
  const [copied, setCopied] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (show) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [show, fadeAnim, scaleAnim]);

  const handleDismiss = () => {
    setCopied(false);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: '',
          showError: false,
        }),
      );
    });
  };

  const handleCopy = () => {
    if (message) {
      Clipboard.setString(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDeviceId = message && message.length > 10 && !message.includes(' ');

  if (!visible) return null;

  return (
    <Portal>
      <Modal transparent visible={visible} onRequestClose={handleDismiss}>
        <Animated.View style={[styles.modalContainer, {opacity: fadeAnim}]}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleDismiss}
          />
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
                transform: [{scale: scaleAnim}],
              },
            ]}>
            <View style={styles.iconWrapper}>
              <View style={styles.iconCircle}>
                <Icon name="check-bold" size={36} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>
                {isDeviceId ? '¡Dispositivo Registrado!' : '¡Operación Exitosa!'}
              </Text>

              {isDeviceId ? (
                <View style={styles.idContainer}>
                  <Text style={styles.idLabel}>ID del Dispositivo</Text>
                  <TouchableOpacity
                    style={styles.idBox}
                    onPress={handleCopy}
                    activeOpacity={0.7}>
                    <Text style={styles.idText} numberOfLines={1}>
                      {message}
                    </Text>
                    <Icon
                      name={copied ? 'check' : 'content-copy'}
                      size={20}
                      color={copied ? '#4CAF50' : '#1C9ADD'}
                    />
                  </TouchableOpacity>
                  {copied && (
                    <Text style={styles.copiedText}>¡Copiado al portapapeles!</Text>
                  )}
                  <Text style={styles.hint}>Toca para copiar el ID</Text>
                </View>
              ) : (
                <Text style={styles.message}>{message}</Text>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={handleDismiss}
                activeOpacity={0.8}>
                <Text style={styles.buttonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  cardWrapper: {
    width: width * 0.85,
    maxWidth: 360,
    alignItems: 'center',
  },
  iconWrapper: {
    zIndex: 10,
    marginBottom: -32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1C9ADD',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1C9ADD',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 44,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  idContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  idLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  idText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copiedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: '500',
  },
  hint: {
    fontSize: 11,
    color: '#999999',
    marginTop: 6,
  },
  button: {
    width: '100%',
    backgroundColor: '#1C9ADD',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1C9ADD',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AlertSuccess;
