import {StackNavigationProp} from '@react-navigation/stack';
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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import dataFormActivation from '../../DataForms/dataFormActivation.json';
import dataFormExtension from '../../DataForms/dataFormExtension.json';
import {useMutationEmergencyAccounting} from '../../services/Accounting/useMutationEmergencyAccounting';
import {useMutationExtensionDays} from '../../services/Accounting/useMutationExtensionDays';
import {useQueryInfoClients} from '../../services/Clients/useQueryInfoClients';
import AlertEmergency from '../Alerts/AlertEmergency';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

interface IUser {
  user: any;
  navigation: StackNavigationProp<any, any>;
  cancelAction?: any;
}

interface ActionButtonProps {
  icon: string;
  label: string;
  colors: string[];
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  colors,
  onPress,
  disabled = false,
  isLoading = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[styles.actionButtonWrapper, {transform: [{scale: pulseAnim}]}]}>
      <TouchableOpacity
        style={[styles.actionButton, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}>
        <LinearGradient
          style={styles.actionButtonGradient}
          colors={disabled ? ['#666', '#888'] : colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Icon name={icon} size={20} color="#FFFFFF" />
          )}
          <Text style={styles.actionButtonText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const UserInfo: React.FC<IUser> = ({
  user,
  navigation,
  cancelAction = () => {},
}) => {
  const buttonInfo = {
    style: {display: 'none'},
    contentStyle: {display: 'none'},
  };

  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [handlerAlert, setHandlerAlert] = React.useState<any>(false);
  const [isEmergency, setIsEmergency] = React.useState<any>(false);
  const [isExtension, setIsExtension] = React.useState<any>(false);
  const [parsedInfo, setParsedInfo] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    idGas: '',
    idAditionalClient: '',
  });
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

  const {data, refetch, isLoading, isError} =
    useQueryInfoClients(dataVariables);
  const {mutate: mutateForEmergency, isPending: isLoadMutation} =
    useMutationEmergencyAccounting();

  const {mutate: mutateExtension, isPending: isLoadingExtension} =
    useMutationExtensionDays();

  React.useEffect(() => {
    if (user && userRedux) {
      if (user._id && userRedux.idGas !== '') {
        setDataVariables({
          idGas: userRedux.idGas,
          idAditionalClient: user._id,
        });
      }
    }
  }, [user, userRedux]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '' && dataVariables.idAditionalClient !== '') {
      refetch();
    }
  }, [dataVariables, refetch]);

  React.useEffect(() => {
    if (data) {
      setParsedInfo(data.getHistoryPayResolver);
    }
  }, [data]);

  if (isLoading || isLoadMutation) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator animating={true} color="#1C9ADD" size="large" />
          </View>
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (isError) {
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
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => cancelAction()}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color="#1C9ADD" />
          <Text style={styles.errorButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Emergency Form View
  if (isEmergency) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Icon name="alert-circle" size={36} color="#FF9800" />
            </View>
            <Text style={styles.headerTitle}>Activación de Emergencia</Text>
            <Text style={styles.headerSubtitle}>
              Ingresa los días para activar temporalmente
            </Text>
          </View>

          <View style={styles.vehicleBadge}>
            <Icon name="car" size={16} color="#1C9ADD" />
            <Text style={styles.vehicleBadgeText}>{user.plates}</Text>
          </View>

          <View style={styles.content}>
            <DynamicForm
              onSubmit={(formData: any) => {
                mutateForEmergency({
                  idGas: userRedux.idGas,
                  idVehicle: user._id,
                  daysToActivate: Number(formData.daysToActivate),
                });
              }}
              isLoading={isLoading}
              json={dataFormActivation}
              labelSubmit=""
              buttonProps={buttonInfo}
              showButton={false}
              formRef={formRef}
            />

            <Animated.View
              style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => formRef.current?.handleSubmit()}
                activeOpacity={0.8}>
                <LinearGradient
                  style={styles.buttonGradient}
                  colors={['#FF9800', '#F57C00']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="lightning-bolt" size={22} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Activar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsEmergency(false)}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={[styles.secondaryButtonText, {color: '#1C9ADD'}]}>
                Regresar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  }

  // Extension Form View
  if (isExtension) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Icon name="calendar-plus" size={36} color="#4CAF50" />
            </View>
            <Text style={styles.headerTitle}>Extensión de Días</Text>
            <Text style={styles.headerSubtitle}>
              Ingresa los días adicionales a agregar
            </Text>
          </View>

          <View style={styles.vehicleBadge}>
            <Icon name="car" size={16} color="#1C9ADD" />
            <Text style={styles.vehicleBadgeText}>{user.plates}</Text>
          </View>

          <View style={styles.content}>
            <DynamicForm
              onSubmit={(formData: any) => {
                if (!isNaN(Number(formData.daysToExtend))) {
                  mutateExtension({
                    idGas: userRedux.idGas,
                    idVehicle: user._id,
                    daysToExtension: Number(formData.daysToExtend),
                  });
                }
              }}
              isLoading={isLoadingExtension}
              json={dataFormExtension}
              labelSubmit=""
              buttonProps={buttonInfo}
              showButton={false}
              formRef={formRef}
            />

            <Animated.View
              style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isLoadingExtension && styles.buttonDisabled,
                ]}
                onPress={() => formRef.current?.handleSubmit()}
                disabled={isLoadingExtension}
                activeOpacity={0.8}>
                <LinearGradient
                  style={styles.buttonGradient}
                  colors={
                    isLoadingExtension
                      ? ['#666', '#888']
                      : ['#4CAF50', '#388E3C']
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  {isLoadingExtension ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Icon name="plus" size={22} color="#FFFFFF" />
                  )}
                  <Text style={styles.buttonText}>
                    {isLoadingExtension ? 'Agregando...' : 'Agregar'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsExtension(false)}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={[styles.secondaryButtonText, {color: '#1C9ADD'}]}>
                Regresar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  }

  // Main Info View
  return (
    <>
      {handlerAlert ? (
        <AlertEmergency
          navigation={navigation}
          show={setHandlerAlert}
          user={userRedux}
        />
      ) : null}

      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Icon name="account-details" size={36} color="#1C9ADD" />
            </View>
            <Text style={styles.headerTitle}>Información</Text>
            <Text style={styles.headerSubtitle}>
              Detalles del vehículo y estado de pago
            </Text>
          </View>

          <View style={styles.vehicleBadge}>
            <Icon name="car" size={16} color="#1C9ADD" />
            <Text style={styles.vehicleBadgeText}>
              {user.plates} - {user.model}
            </Text>
          </View>

          <View style={styles.content}>
            {parsedInfo ? (
              <>
                {/* Optional Payment - Can pay but not required */}
                {!parsedInfo.isOptional &&
                !parsedInfo.isObligatory &&
                !parsedInfo.isDone ? (
                  <View style={styles.infoCard}>
                    <View style={styles.infoCardHeader}>
                      <View style={styles.statusBadgeOptional}>
                        <Icon name="clock-outline" size={16} color="#FF9800" />
                        <Text style={styles.statusBadgeText}>
                          Pago Opcional
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.infoCardText}>
                      El equipo con placas{' '}
                      <Text style={styles.highlight}>{user.plates}</Text> y
                      modelo <Text style={styles.highlight}>{user.model}</Text>{' '}
                      fue adquirido con un precio de{' '}
                      <Text style={styles.highlight}>
                        ${parsedInfo.totalOriginalPrice}
                      </Text>{' '}
                      de los cuales ha pagado{' '}
                      <Text style={styles.highlight}>
                        ${parsedInfo.totalPrice}
                      </Text>
                      . La siguiente fecha de pago es el día{' '}
                      <Text style={styles.highlight}>
                        {parsedInfo.parsedData}
                      </Text>{' '}
                      y por tanto no es obligatorio pagar en estos momentos,
                      pero puede hacerlo si así lo desea.
                    </Text>
                  </View>
                ) : null}

                {/* Obligatory Payment - Must pay */}
                {!parsedInfo.isOptional &&
                parsedInfo.isObligatory &&
                !parsedInfo.isDone ? (
                  <View style={[styles.infoCard, styles.infoCardUrgent]}>
                    <View style={styles.infoCardHeader}>
                      <View style={styles.statusBadgeUrgent}>
                        <Icon name="alert" size={16} color="#E53935" />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            {color: '#E53935'},
                          ]}>
                          Pago Obligatorio
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.infoCardText}>
                      El equipo con placas{' '}
                      <Text style={styles.highlight}>{user.plates}</Text> y
                      modelo <Text style={styles.highlight}>{user.model}</Text>{' '}
                      fue adquirido con un precio de{' '}
                      <Text style={styles.highlight}>
                        ${parsedInfo.totalOriginalPrice}
                      </Text>{' '}
                      de los cuales ha pagado{' '}
                      <Text style={styles.highlight}>
                        ${parsedInfo.totalPrice}
                      </Text>
                      . La fecha de pago fue el día{' '}
                      <Text style={styles.highlightUrgent}>
                        {parsedInfo.parsedData}
                      </Text>{' '}
                      y por tanto es obligatorio pagar. Reportar pago a la
                      brevedad.
                    </Text>
                  </View>
                ) : null}

                {/* Payment Complete */}
                {parsedInfo.isComplete || parsedInfo.isOptional ? (
                  <View style={[styles.infoCard, styles.infoCardComplete]}>
                    <View style={styles.infoCardHeader}>
                      <View style={styles.statusBadgeComplete}>
                        <Icon name="check-circle" size={16} color="#4CAF50" />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            {color: '#4CAF50'},
                          ]}>
                          Pago Completado
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.infoCardText}>
                      El equipo con placas{' '}
                      <Text style={styles.highlight}>{user.plates}</Text> y
                      modelo <Text style={styles.highlight}>{user.model}</Text>{' '}
                      se ha terminado de pagar.
                    </Text>

                    <TouchableOpacity
                      style={[styles.secondaryButton, {marginTop: 20}]}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}>
                      <Icon name="arrow-left" size={20} color="#1C9ADD" />
                      <Text
                        style={[styles.secondaryButtonText, {color: '#1C9ADD'}]}>
                        Regresar
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* Action Buttons - Show when payment is not complete */}
                {!parsedInfo.isOptional && !parsedInfo.isComplete ? (
                  <View style={styles.actionsContainer}>
                    <ActionButton
                      icon="credit-card-check"
                      label="Registrar Pago"
                      colors={['#4CAF50', '#388E3C']}
                      onPress={() => {
                        const allInfo = {
                          infoData: {...user},
                          paymentData: {...parsedInfo},
                        };
                        navigation.navigate('FormPay', {
                          user: allInfo,
                        });
                      }}
                    />

                    <ActionButton
                      icon="lightning-bolt"
                      label="Activación de Emergencia"
                      colors={['#FF9800', '#F57C00']}
                      onPress={() => setIsEmergency(true)}
                    />

                    <ActionButton
                      icon="calendar-plus"
                      label="Extensión de Días"
                      colors={['#1C9ADD', '#0D7ABC']}
                      onPress={() => setIsExtension(true)}
                    />
                  </View>
                ) : null}

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelAction()}
                  activeOpacity={0.8}>
                  <Icon name="close" size={20} color="#E53935" />
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </>
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
    fontSize: 32,
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
  vehicleBadge: {
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
  vehicleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
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
  infoCardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  infoCardComplete: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoCardHeader: {
    marginBottom: 12,
  },
  statusBadgeOptional: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusBadgeUrgent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusBadgeComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
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
  highlightUrgent: {
    fontWeight: '700',
    color: '#E53935',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  actionButtonWrapper: {
    width: '100%',
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
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButton: {
    width: width * 0.7,
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
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 20,
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
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
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
    backgroundColor: '#E3F2FD',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C9ADD',
  },
});

export default UserInfo;
