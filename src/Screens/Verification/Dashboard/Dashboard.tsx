/* eslint-disable react-hooks/exhaustive-deps */
import {StackNavigationProp} from '@react-navigation/stack';
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
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';
import {useQueryGetPrivateGas} from '../../../services/Verification/useQueryGetPrivateGas';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

interface IDashboard {
  navigation: StackNavigationProp<any, any>;
}

const Dashboard: React.FC<IDashboard> = ({navigation}) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const user = useSelector((store: IStore) => store.loggedUser);

  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    idGas: '',
  });

  const {
    data: data2,
    refetch: refetch2,
    isLoading,
    isError,
    isFetching,
  } = useQueryGetPrivateGas({
    current: dataVariables.current,
    limit: dataVariables.limit,
    fieldFind: dataVariables.fieldFind,
    idUser: userRedux._id,
  });

  React.useEffect(() => {
    if (user?.idGas && user.idGas !== '') {
      setDataVariables({...dataVariables, idGas: user.idGas});
    }
  }, [user]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch2();
    }
  }, [dataVariables]);

  if (isLoading) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingText}>Cargando gaseras...</Text>
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
              <Icon name="alert-circle-outline" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error de Conexión</Text>
            <Text style={styles.errorText}>
              No se pudieron cargar las gaseras.{'\n'}Inténtalo más tarde.
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
          <Icon name="shield-check" size={40} color="#00BCD4" />
        </View>
        <Text style={styles.headerTitle}>GASERAS</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona una gasera para verificar
        </Text>
      </View>

      {/* Stats Badge */}
      {data2 && (
        <View style={styles.badgeContainer}>
          <View style={styles.statsBadge}>
            <Icon name="office-building" size={16} color="#00BCD4" />
            <Text style={styles.statsBadgeText}>
              {data2.gaserasPrivateResolver.total} gasera
              {data2.gaserasPrivateResolver.total !== 1 ? 's' : ''} disponible
              {data2.gaserasPrivateResolver.total !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      {/* List */}
      <View style={styles.listContainer}>
        {data2 ? (
          <UsersFlatList
            initial={true}
            navigation={navigation}
            isFetching={isFetching}
            data={data2.gaserasPrivateResolver.data}
            limitPerPage={2}
            toScreen={'GetClientsToVerification'}
            setDataVariables={setDataVariables}
            dataVariables={dataVariables}
            totalItems={data2.gaserasPrivateResolver.total}
            isGas={true}
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
    marginBottom: 12,
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

export default Dashboard;
