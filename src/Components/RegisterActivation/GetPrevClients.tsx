import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useQueryGetClients} from '../../services/Clients/useQueryGetClients';
import UsersFlatList from '../UsersFlatList/UsersFlatList';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

interface IDashboard {
  navigation: any;
  serialNumber: any;
}

const GetPrevClients: React.FC<IDashboard> = ({navigation, serialNumber}) => {
  const user = useSelector((store: IStore) => store.loggedUser);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    idGas: '',
  });

  const {data, refetch, isLoading, isError, isFetching} =
    useQueryGetClients(dataVariables);

  React.useEffect(() => {
    if (user) {
      if (user.idGas && user.idGas !== '') {
        setDataVariables({...dataVariables, idGas: user.idGas});
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
    }
  }, [dataVariables]);

  if (isLoading) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando clientes...</Text>
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
              No se pudo conectar con el servidor.{'\n'}Intenta de nuevo más tarde.
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
          <Icon name="account-search" size={32} color="#1C9ADD" />
        </View>
        <Text style={styles.headerTitle}>Busca y Selecciona</Text>
        <Text style={styles.headerSubtitle}>
          Encuentra el cliente para vincular el dispositivo
        </Text>
      </View>

      {/* Serial Badge */}
      <View style={styles.serialBadge}>
        <Icon name="qrcode" size={18} color="#4CAF50" />
        <Text style={styles.serialBadgeText}>N° Serie: {serialNumber}</Text>
      </View>

      {/* Client List */}
      <View style={styles.listContainer}>
        {data ? (
          <UsersFlatList
            navigation={navigation}
            isFetching={isFetching}
            data={data.getClientsResolver.data}
            limitPerPage={2}
            toScreen={'RegisterPrevVehicle'}
            serialNumber={serialNumber}
            setDataVariables={setDataVariables}
            dataVariables={dataVariables}
            totalItems={data.getClientsResolver.total}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="account-off" size={48} color="#CCC" />
            <Text style={styles.emptyStateText}>No se encontraron clientes</Text>
          </View>
        )}
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
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  serialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
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
  serialBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});

export default GetPrevClients;
