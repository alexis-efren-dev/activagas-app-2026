import {useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Switch,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useMutationUpdateEnabledVehicle} from '../../services/Register/useMutationUpdateEnabledVehicle';
import {useQueryEnabledVehicle} from '../../services/Register/useQueryEnabledVehicle';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

const EnableVehicleById = (props: any): JSX.Element => {
  const {mutate, isPending: isLoadingMutate} =
    useMutationUpdateEnabledVehicle();
  const navigation = useNavigation();
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [user, setUser] = React.useState<any>(false);
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const onEnabledSwitch = () => setIsEnabled(!isEnabled);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
  }, []);

  const {refetch, isError, isLoading, isFetching, data} =
    useQueryEnabledVehicle({
      idGas: userRedux.idGas,
      idVehicle: user._id,
    });

  useEffect(() => {
    if (userRedux) {
      if (userRedux.idGas !== '' && !controllerQuery && user) {
        refetch();
        setControllerQuery(true);
      }
    }
  }, [userRedux, user]);

  useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);

  useEffect(() => {
    if (data) {
      setIsEnabled(data.getEnabledVehicleResolver);
    }
  }, [data]);

  if (isLoading || isFetching || !user || data === undefined) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (isError) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Icon name="server-off" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error de Conexión</Text>
            <Text style={styles.errorText}>
              No se pudo cargar la información.{'\n'}Intenta de nuevo más tarde.
            </Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={styles.errorButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
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
          <Icon
            name={isEnabled ? 'car-off' : 'car'}
            size={40}
            color={isEnabled ? '#E53935' : '#4CAF50'}
          />
        </View>
        <Text style={styles.headerTitle}>Estado del Vehículo</Text>
        <Text style={styles.headerSubtitle}>
          Gestiona el estado de habilitación
        </Text>
      </Animated.View>

      {/* Vehicle Info Card */}
      <Animated.View
        style={[
          styles.vehicleCard,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <View style={styles.vehicleCardHeader}>
          <View style={styles.vehicleIconContainer}>
            <Icon name="car" size={24} color="#FF9800" />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehiclePlates}>{user.plates || 'Sin placas'}</Text>
            <Text style={styles.vehicleModel}>{user.model || 'Sin modelo'}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Status Card */}
      <Animated.View
        style={[
          styles.statusCard,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <Text style={styles.statusTitle}>¿Deshabilitar vehículo?</Text>
        <Text style={styles.statusDescription}>
          Un vehículo deshabilitado no podrá realizar activaciones
        </Text>

        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <View
              style={[
                styles.statusIndicator,
                {backgroundColor: isEnabled ? '#FFEBEE' : '#E8F5E9'},
              ]}>
              <Icon
                name={isEnabled ? 'close-circle' : 'check-circle'}
                size={20}
                color={isEnabled ? '#E53935' : '#4CAF50'}
              />
              <Text
                style={[
                  styles.statusIndicatorText,
                  {color: isEnabled ? '#E53935' : '#4CAF50'},
                ]}>
                {isEnabled ? 'Deshabilitado' : 'Habilitado'}
              </Text>
            </View>

            <Switch
              value={isEnabled}
              onValueChange={onEnabledSwitch}
              trackColor={{false: '#E8F5E9', true: '#FFCDD2'}}
              thumbColor={isEnabled ? '#E53935' : '#4CAF50'}
              ios_backgroundColor="#E8F5E9"
            />
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[
            styles.updateButton,
            isLoadingMutate && styles.updateButtonDisabled,
          ]}
          disabled={isLoadingMutate}
          onPress={() =>
            mutate({
              idGas: userRedux.idGas,
              idVehicle: user._id,
              plates: user.plates,
              disabled: isEnabled,
            })
          }
          activeOpacity={0.85}>
          <LinearGradient
            style={styles.updateButtonGradient}
            colors={isLoadingMutate ? ['#B0BEC5', '#90A4AE'] : ['#1C9ADD', '#0D7FBF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            {isLoadingMutate ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon name="content-save" size={20} color="#FFFFFF" />
                <Text style={styles.updateButtonText}>Guardar Cambios</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Back Button */}
      <Animated.View
        style={[
          styles.backButtonContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color="#666" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
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
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
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
  vehicleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehiclePlates: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  vehicleModel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
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
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  switchContainer: {
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 8,
  },
  statusIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  updateButton: {
    borderRadius: 12,
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
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButtonContainer: {
    alignItems: 'center',
    paddingVertical: 24,
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

export default EnableVehicleById;
