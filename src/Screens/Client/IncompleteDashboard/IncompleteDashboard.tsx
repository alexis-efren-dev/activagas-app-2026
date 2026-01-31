/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import useDataLayer from '../../../hooks/useDataLayer';
import {useMutationValidationIncomplete} from '../../../services/Activation/useMutationValidationIncomplete';
import {useQueryGetReadTime} from '../../../services/Configurations/useQueryGetReadTime';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

const IncompleteDashboard = (props: any) => {
  const [variables, setVariables] = useState<any>();
  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);
  const [controllerState, setControllerState] = useState(false);
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [infoVehicle, setInfoVehicle] = React.useState<any>(null);
  const [controllerTime, setControllerTime] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);
  const {plates} = useSelector((store: IStore) => store.currentPlates);
  const {
    mutate,
    isPending: isLoadingMutation,
    reset,
  } = useMutationValidationIncomplete();
  const {data, refetch, error, isLoading, isFetching} = useQueryGetReadTime({
    idGas: user.idGas,
  });
  const [nfcSerial, setNfcSerial] = useState<any>(false);

  const terminateWriteCallback = useCallback((dataNfc: string) => {
    setNfcSerial(dataNfc);
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
  });

  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        refetch();
        setControllerQuery(true);
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setInfoVehicle(props.route.params.item);
    } else if (props?.route?.params) {
      setInfoVehicle(false);
    } else {
      setInfoVehicle({plates});
    }
  }, [props]);

  React.useEffect(() => {
    if (data?.getReadTimeAppResolver) {
      setControllerTime(Number(data.getReadTimeAppResolver) * 1000);
    }
  }, [data]);

  React.useEffect(() => {
    if (keys.key !== '' && controllerState) {
      updateProp('writable', false);
      setControllerState(false);
      props.navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'Activation',
        variables,
        path:
          infoVehicle?.plates === 'plates' ? 'incomplete' : 'incompleteClient',
      });
    }
  }, [keys]);

  React.useEffect(() => {
    if (nfcSerial && infoVehicle?.plates === 'plates') {
      setControllerState(true);
      updateProp('writable', false);
      setVariables({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: nfcSerial,
      });
      mutate({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: nfcSerial,
      });
    }
  }, [nfcSerial, infoVehicle]);

  React.useEffect(() => {
    switchSession(true);
    updateProp('writable', true);
    setNfcSerial(false);
    return () => {
      reset();
      updateProp('writable', false);
      setNfcSerial(false);
    };
  }, []);

  const handleGoBack = () => {
    if (plates === '') {
      props.navigation.goBack();
    } else {
      props.navigation.goBack();
      props.navigation.goBack();
    }
  };

  const handleComplete = () => {
    if (infoVehicle) {
      setControllerState(true);
      setVariables({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: infoVehicle.serialPlates
          ? infoVehicle.serialPlates
          : infoVehicle.plates,
      });
      mutate({
        idGas: user.idGas,
        idDispatcher: user._id,
        serialNumber: infoVehicle.serialPlates
          ? infoVehicle.serialPlates
          : infoVehicle.plates,
      });
    }
  };

  if (infoVehicle === null || isLoading || isFetching) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (infoVehicle === false || error) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Icon name="alert-circle-outline" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>
              No se pudo cargar la información.{'\n'}Inténtalo más tarde.
            </Text>
            <TouchableOpacity
              style={styles.backButtonError}
              onPress={handleGoBack}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={styles.backButtonErrorText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="clock-check" size={40} color="#4CAF50" />
        </View>
        <Text style={styles.headerTitle}>COMPLETAR ACTIVACIÓN</Text>
        <Text style={styles.headerSubtitle}>
          Finaliza tu activación pendiente
        </Text>
      </View>

      {/* Content based on state */}
      {infoVehicle?.plates !== 'plates' ? (
        /* Has vehicle info - show complete button */
        <View style={styles.contentContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Icon name="car" size={24} color="#4CAF50" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Placas del vehículo</Text>
                <Text style={styles.infoValue}>
                  {infoVehicle?.plates || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.85}
            disabled={isLoadingMutation}>
            <LinearGradient
              style={styles.completeButtonGradient}
              colors={['#4CAF50', '#388E3C']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              {isLoadingMutation ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="check-circle" size={28} color="#FFFFFF" />
                  <Text style={styles.completeButtonText}>COMPLETAR</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : enabled ? (
        /* NFC mode - waiting for device */
        <View style={styles.nfcPromptContainer}>
          <View style={styles.nfcCard}>
            <View style={styles.nfcIconContainer}>
              <Icon name="nfc" size={64} color="#4CAF50" />
            </View>
            <Text style={styles.nfcTitle}>Lectura NFC</Text>
            <Text style={styles.nfcText}>
              Acerca tu dispositivo al equipo para completar la activación
              pendiente.
            </Text>
            <View style={styles.nfcBadge}>
              <Icon name="cellphone-nfc" size={18} color="#4CAF50" />
              <Text style={styles.nfcBadgeText}>NFC Activo</Text>
            </View>
          </View>
        </View>
      ) : (
        /* NFC disabled */
        <View style={styles.nfcDisabledContainer}>
          <View style={styles.nfcDisabledCard}>
            <View style={styles.nfcDisabledIconContainer}>
              <Icon name="nfc-off" size={48} color="#FF9800" />
            </View>
            <Text style={styles.nfcDisabledTitle}>NFC Requerido</Text>
            <Text style={styles.nfcDisabledText}>
              Para usar este módulo, necesitas activar el NFC de tu dispositivo.
            </Text>
          </View>
        </View>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.8}>
        <Icon name="arrow-left" size={20} color="#666" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
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
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width * 0.85,
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
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  backButtonError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonErrorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width - 40,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
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
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 60,
    gap: 12,
  },
  completeButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  nfcPromptContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nfcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width - 40,
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
  nfcIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  nfcTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  nfcText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  nfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    gap: 8,
  },
  nfcBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  nfcDisabledContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nfcDisabledCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width - 40,
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
  nfcDisabledIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nfcDisabledTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 12,
  },
  nfcDisabledText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 40,
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
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default IncompleteDashboard;
