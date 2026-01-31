import React, {useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import UsersFlatList from '../../Components/UsersFlatList/UsersFlatList';
import {IStore} from '../../redux/store';
import {useQueryGetVehicles} from '../../services/Vehicles/useQueryGetVehicles';

const {width} = Dimensions.get('screen');

const UpdateVehicle = (props: any) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [user, setUser] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    id: '',
    idGas: '',
  });

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

  const {data, error, refetch, isLoading, isFetching} =
    useQueryGetVehicles(dataVariables);

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
    if (userRedux._id !== '' && user) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: user._id,
        idGas: userRedux.idGas,
      }));
    }
  }, [userRedux, user]);

  useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
    }
  }, [dataVariables]);

  if (user === false || isLoading || !data) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando vehículos...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (user === '' || error) {
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
          <Icon name="car-cog" size={36} color="#4CAF50" />
        </View>
        <Text style={styles.headerTitle}>Editar Vehículo</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona un vehículo para modificar
        </Text>
      </Animated.View>

      {/* User Badge */}
      {user && (
        <Animated.View
          style={[
            styles.userBadge,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Icon name="account" size={16} color="#1C9ADD" />
          <Text style={styles.userBadgeText}>{user.firstName || 'Cliente'}</Text>
        </Animated.View>
      )}

      {/* Vehicles List */}
      <Animated.View
        style={[
          styles.listContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <UsersFlatList
          navigation={props.navigation}
          isFetching={isFetching}
          data={data.getVehiclesResolver.data}
          limitPerPage={2}
          toScreen={'UpdateVehicleById'}
          setDataVariables={setDataVariables}
          dataVariables={dataVariables}
          isVehicle={true}
          totalItems={data.getVehiclesResolver.total}
        />
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
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
  userBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
});

export default UpdateVehicle;
