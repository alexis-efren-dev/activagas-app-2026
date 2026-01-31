import React from 'react';
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
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {IStore} from '../../../redux/store';
import {useQueryGetVehicles} from '../../../services/Vehicles/useQueryGetVehicles';

const {width} = Dimensions.get('screen');

const GetVehicles = (props: any) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [user, setUser] = React.useState<any>(false);
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
    } else if (props?.route?.params) {
      setUser('');
    }
  }, [props]);

  React.useEffect(() => {
    if (userRedux._id !== '' && user) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: user._id,
        idGas: userRedux.idGas,
      }));
    }
  }, [userRedux, user]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVariables]);

  if (user === false || isLoading) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator animating={true} color="#FF9800" size="large" />
          </View>
          <Text style={styles.loadingText}>Cargando vehiculos...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (user === '' || error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Icon name="car-off" size={48} color="#E53935" />
        </View>
        <Text style={styles.errorTitle}>Error de conexion</Text>
        <Text style={styles.errorText}>
          No se pudo cargar la informacion de los vehiculos.{'\n'}Por favor,
          intentalo mas tarde.
        </Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => props.navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color="#FF9800" />
          <Text style={styles.errorButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="car-multiple" size={36} color="#FF9800" />
        </View>
        <Text style={styles.headerTitle}>VEHICULOS</Text>
        <Text style={styles.headerSubtitle}>
          Vehiculos del cliente seleccionado
        </Text>
      </View>

      {/* Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Icon name="format-list-bulleted" size={16} color="#FF9800" />
          <Text style={styles.badgeText}>Lista de Vehiculos</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {data ? (
          <UsersFlatList
            navigation={props.navigation}
            isFetching={isFetching}
            data={data.getVehiclesResolver.data}
            limitPerPage={2}
            toScreen={'VerifyPay'}
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
    marginBottom: 16,
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
    marginBottom: 8,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
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
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    width: width,
    alignItems: 'center',
    paddingBottom: 100,
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
    backgroundColor: '#FFF3E0',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
});

export default GetVehicles;
