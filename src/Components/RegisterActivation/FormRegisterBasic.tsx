import React, {useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import 'react-native-get-random-values';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {v4 as uuidv4} from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import dataFormBasicUser from '../../DataForms/dataFormRegisterBasicUser.json';
import {useMutationRegister} from '../../services/Register/BasicRegister';
import {DynamicForm} from '../DynamicForms/DynamicForm';

const {width} = Dimensions.get('screen');

interface IDataRegisterBasic {
  cellPhone: string;
  password: string;
  confirmPassword: string;
}

interface IProps {
  navigation: any;
}

const FormRegisterBasic: React.FC<IProps> = ({navigation}): JSX.Element => {
  const [temporalPass, setTemporalPass] = React.useState<any>('');
  const [visibleError, setVisibleError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const mutation = useMutationRegister();
  const {data, isPending: isLoading} = mutation;
  const formRef = useRef<any>(null);
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

  const handleSubmit = (dataFields: IDataRegisterBasic) => {
    if (
      isNaN(Number(dataFields.cellPhone)) ||
      String(dataFields.cellPhone).indexOf('.') > -1
    ) {
      setErrorMessage('Numero no valido');
      setVisibleError(true);
    } else if (dataFields.password !== dataFields.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setVisibleError(true);
    } else {
      mutation.mutate({
        cellPhone: Number(dataFields.cellPhone),
        idRol: '60fc6def3d097dcce8a1f077',
        password: temporalPass,
      });
    }
  };

  if (data) {
    mutation.reset();
  }

  const buttonInfo = {
    style: {display: 'none'},
    contentStyle: {display: 'none'},
  };

  React.useEffect(() => {
    setTemporalPass(uuidv4());
  }, []);

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="account-edit" size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Registro de Datos</Text>
          <Text style={styles.headerSubtitle}>
            Ingresa los datos básicos del cliente
          </Text>
        </View>

        {/* Step Badge */}
        <View style={styles.badge}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.badgeText}>Paso 1 de 2</Text>
        </View>

        {/* Error Card */}
        {visibleError && (
          <View style={styles.errorCard}>
            <View style={styles.errorHeader}>
              <Icon name="alert-circle" size={20} color="#E53935" />
              <Text style={styles.errorTitle}>Error</Text>
            </View>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorDismiss}
              onPress={() => setVisibleError(false)}>
              <Icon name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Icon name="information" size={20} color="#1C9ADD" />
            <Text style={styles.infoCardTitle}>Información</Text>
          </View>
          <Text style={styles.infoCardText}>
            Registra el número de celular del cliente. Este número será usado
            para{' '}
            <Text style={styles.highlight}>iniciar sesión en la aplicación</Text>{' '}
            y recibir notificaciones.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <DynamicForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            json={dataFormBasicUser}
            labelSubmit=""
            buttonProps={buttonInfo}
            showButton={false}
            formRef={formRef}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Animated.View
            style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={() => formRef.current?.handleSubmit()}
              disabled={isLoading}
              activeOpacity={0.8}>
              <LinearGradient
                style={styles.buttonGradient}
                colors={isLoading ? ['#666', '#888'] : ['#4CAF50', '#388E3C']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Icon name="arrow-right" size={22} color="#FFFFFF" />
                )}
                <Text style={styles.buttonText}>
                  {isLoading ? 'Procesando...' : 'Continuar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register', {})}
            activeOpacity={0.8}>
            <Icon name="close" size={20} color="#E53935" />
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Icon name="lock" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.footerNoteText}>
            Los datos están protegidos y encriptados
          </Text>
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
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1C9ADD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    width: width * 0.9,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C62828',
  },
  errorText: {
    fontSize: 14,
    color: '#B71C1C',
    lineHeight: 20,
  },
  errorDismiss: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    marginBottom: 20,
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
    color: '#1C9ADD',
  },
  infoCardText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '700',
    color: '#1C9ADD',
  },
  formContainer: {
    width: width * 0.9,
    marginBottom: 10,
  },
  buttonsContainer: {
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerNoteText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default FormRegisterBasic;
