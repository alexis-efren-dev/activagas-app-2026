import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useQueryGetReadTime} from '../../../services/Configurations/useQueryGetReadTime';
import {useMutationValidationEmergency} from '../../../services/Activation/useMutationValidationEmergency';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

const UseEmergency = (props: any) => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [infoVehicle, setInfoVehicle] = React.useState<any>(null);
  const [controllerTime, setControllerTime] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);
  const {mutate, isPending} = useMutationValidationEmergency();
  const {data, refetch, error, isLoading, isFetching} = useQueryGetReadTime({
    idGas: user.idGas,
  });

  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        refetch();
        setControllerQuery(true);
      }
    }
  }, [user, controllerQuery, refetch]);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setInfoVehicle(props.route.params.item);
    } else if (props?.route?.params) {
      setInfoVehicle(false);
    }
  }, [props]);

  React.useEffect(() => {
    if (data?.getReadTimeAppResolver) {
      setControllerTime(Number(data.getReadTimeAppResolver) * 1000);
    }
  }, [data]);

  React.useEffect(() => {
    if (keys.key !== '' && infoVehicle) {
      props.navigation.navigate('ScannerScreenHce', {
        user,
        key: keys.key,
        controllerTime: controllerTime,
        routeRefresh: 'Dashboard',
        path: 'emergency',
        variables: {
          idGas: user.idGas,
          idDispatcher: user._id,
          idKeyEmergency: infoVehicle._id,
          serialNumber: infoVehicle.serialNumber,
        },
      });
    }
  }, [keys, infoVehicle, controllerTime, props.navigation, user]);

  const handleActivate = () => {
    if (infoVehicle) {
      mutate({
        idGas: user.idGas,
        idDispatcher: user._id,
        idKeyEmergency: infoVehicle._id,
        serialNumber: infoVehicle.serialNumber,
      });
    }
  };

  if (infoVehicle === null || isLoading || isFetching) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#E91E63" />
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
              onPress={() => props.navigation.goBack()}
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
          <Icon name="alarm-light" size={40} color="#E91E63" />
        </View>
        <Text style={styles.headerTitle}>ACTIVACIÓN DE EMERGENCIA</Text>
        <Text style={styles.headerSubtitle}>
          Presiona el botón para activar
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Icon name="clock-outline" size={24} color="#E91E63" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Horas disponibles</Text>
            <Text style={styles.infoValue}>{infoVehicle.value} hrs</Text>
          </View>
        </View>

        {infoVehicle.serialNumber && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Icon name="identifier" size={24} color="#1C9ADD" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Número de serie</Text>
              <Text style={styles.infoValue}>{infoVehicle.serialNumber}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Activate Button */}
      <TouchableOpacity
        style={styles.activateButton}
        onPress={handleActivate}
        activeOpacity={0.85}
        disabled={isPending}>
        <LinearGradient
          style={styles.activateButtonGradient}
          colors={['#E91E63', '#C2185B']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          {isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="flash" size={28} color="#FFFFFF" />
              <Text style={styles.activateButtonText}>ACTIVAR</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Warning Badge */}
      <View style={styles.warningBadge}>
        <Icon name="information-outline" size={18} color="#FF9800" />
        <Text style={styles.warningText}>
          Esta acción consumirá una activación de emergencia
        </Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => props.navigation.goBack()}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FCE4EC',
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
  activateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#E91E63',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  activateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 60,
    gap: 12,
  },
  activateButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 30,
    gap: 10,
    maxWidth: width - 40,
  },
  warningText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '500',
    flex: 1,
  },
  backButton: {
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
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default UseEmergency;
