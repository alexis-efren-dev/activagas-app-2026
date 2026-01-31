import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import {Portal, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

const AlertError = () => {
  const dispatch = useDispatch();
  const {messageError, showError} = useSelector((data: IStore) => data.alerts);
  const [visible, setVisible] = React.useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (showError) {
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
  }, [showError, fadeAnim, scaleAnim]);

  const handleDismiss = () => {
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

  const isDeviceError =
    messageError &&
    (messageError.toLowerCase().includes('dispositivo') ||
      messageError.toLowerCase().includes('escanear') ||
      messageError.toLowerCase().includes('id'));

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
                <Icon name="close-thick" size={36} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>
                {isDeviceError ? '¡Error de Dispositivo!' : '¡Ha ocurrido un error!'}
              </Text>

              <View style={styles.errorContainer}>
                <View style={styles.errorIconRow}>
                  <Icon name="alert-circle-outline" size={20} color="#E53935" />
                  <Text style={styles.errorLabel}>Detalles del error</Text>
                </View>
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{messageError}</Text>
                </View>
                {isDeviceError && (
                  <Text style={styles.hint}>
                    Verifica que tu dispositivo esté correctamente configurado
                  </Text>
                )}
              </View>

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
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E53935',
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
  errorContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E53935',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C62828',
    textAlign: 'center',
    lineHeight: 20,
  },
  hint: {
    fontSize: 11,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E53935',
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

export default AlertError;
