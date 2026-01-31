/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {IStore} from '../../../redux/store';
import {useQueryGetVehicles} from '../../../services/Vehicles/useQueryGetVehicles';

const {width} = Dimensions.get('screen');

const GetVehicles = (props: any) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [user, setUser] = React.useState<any>(null);
  const [idFullGas, setIdFullGas] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    id: '',
    idGas: '',
  });

  const {data, error, refetch, isLoading, isFetching} =
    useQueryGetVehicles(dataVariables);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setUser(props.route.params.item);
      setIdFullGas(props.route.params.idGasFull);
    } else if (props?.route?.params) {
      setUser(false);
    }
  }, [props]);

  React.useEffect(() => {
    if (userRedux._id !== '' && user) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: user._id,
        idGas: idFullGas,
      }));
    }
  }, [userRedux, user, idFullGas]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
    }
  }, [dataVariables]);

  if (user === null || isLoading) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingText}>Cargando vehículos...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (user === false || error) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Icon name="alert-circle-outline" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error de Conexión</Text>
            <Text style={styles.errorText}>
              No se pudieron cargar los vehículos.{'\n'}Inténtalo más tarde.
            </Text>
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
          <Icon name="car-multiple" size={40} color="#00BCD4" />
        </View>
        <Text style={styles.headerTitle}>VEHÍCULOS</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona un vehículo para verificar
        </Text>
      </View>

      {/* Client Info Badge */}
      {user && (
        <View style={styles.badgeContainer}>
          <View style={styles.clientBadge}>
            <Icon name="account" size={16} color="#00BCD4" />
            <Text style={styles.clientBadgeText}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
        </View>
      )}

      {/* Stats Badge */}
      {data && (
        <View style={styles.badgeContainer}>
          <View style={styles.statsBadge}>
            <Icon name="car" size={16} color="#00BCD4" />
            <Text style={styles.statsBadgeText}>
              {data.getVehiclesResolver.total} vehículo
              {data.getVehiclesResolver.total !== 1 ? 's' : ''} registrado
              {data.getVehiclesResolver.total !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      {/* List */}
      <View style={styles.listContainer}>
        {data ? (
          <UsersFlatList
            navigation={props.navigation}
            isFetching={isFetching}
            data={data.getVehiclesResolver.data}
            limitPerPage={2}
            toScreen={'VerifyUnit'}
            setDataVariables={setDataVariables}
            dataVariables={dataVariables}
            isVehicle={true}
            totalItems={data.getVehiclesResolver.total}
          />
        ) : null}
      </View>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
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
    width: width - 48,
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
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
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
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  clientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  clientBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
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
  statsBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  listContainer: {
    flex: 1,
    width: width,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});

export default GetVehicles;
