/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useQueryGetVehicleInformation} from '../../../services/Clients/useQueryGetVehicleInformation';
import {CardVehicle} from '../../../Components/CardInformation/CardVehicle';
import {IStore} from '../../../redux/store';

const {width} = Dimensions.get('screen');

const UpdateVehicles = (props: any) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [infoVehicle, setInfoVehicle] = React.useState<any>(null);
  const [dataVariables, setDataVariables] = React.useState<any>({
    idClient: userRedux._id,
    serialNumber: '',
  });

  const {data, error, refetch, isLoading, isFetching} =
    useQueryGetVehicleInformation(dataVariables);

  React.useEffect(() => {
    if (userRedux._id !== '' && infoVehicle) {
      setDataVariables(() => ({
        idClient: userRedux._id,
        serialNumber: infoVehicle.serialNumber,
      }));
    }
  }, [userRedux, infoVehicle]);

  React.useEffect(() => {
    if (dataVariables.serialNumber !== '') {
      refetch();
    }
  }, [dataVariables]);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setInfoVehicle(props.route.params.item);
    } else if (props?.route?.params) {
      setInfoVehicle(false);
    }
  }, [props]);

  if (infoVehicle === null || isLoading || isFetching) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#FF9800" />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (error || infoVehicle === false) {
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
          <Icon name="car-info" size={40} color="#FF9800" />
        </View>
        <Text style={styles.headerTitle}>INFORMACIÓN DEL VEHÍCULO</Text>
        <Text style={styles.headerSubtitle}>
          Detalles y configuración
        </Text>
      </View>

      {/* Vehicle Card */}
      <View style={styles.contentContainer}>
        {data ? <CardVehicle vehicle={data.readUserByResolver} /> : null}
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
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    width: width,
  },
});

export default UpdateVehicles;
