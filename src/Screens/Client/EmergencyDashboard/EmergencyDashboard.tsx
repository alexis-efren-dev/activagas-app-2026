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
import {useDispatch, useSelector} from 'react-redux';
import UsersFlatList from '../../../Components/UsersFlatList/UsersFlatList';

import {useNavigation} from '@react-navigation/native';
import {useQueryEmergencyActivationsClient} from '../../../services/Emergency/useQueryEmergencyActivationsClient';
import useDataLayer from '../../../hooks/useDataLayer';
import {currentPlatesAction} from '../../../redux/states/currentPlatesSlice';
import {routesAction} from '../../../redux/states/routesSlice';
import {IStore} from '../../../redux/store';
import {useQueryClient} from '@tanstack/react-query';

const {width} = Dimensions.get('screen');

const EmergencyDashboard = (props: any) => {
  const [nfcSerial, setNfcSerial] = useState<any>(false);

  const terminateWriteCallback = useCallback((data: string) => {
    setNfcSerial(data);
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
  });
  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);
  const client = useQueryClient();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const currentPlates = useSelector((store: IStore) => store.currentPlates);
  const [plates, setPlates] = useState('');
  const [infoVehicle, setInfoVehicle] = React.useState<any>(null);
  const [dataVariables, setDataVariables] = React.useState<any>({
    current: 1,
    limit: 2,
    fieldFind: '',
    id: '',
    idGas: '',
    idVehicle: '',
  });
  const {data, error, refetch, isLoading, isFetching} =
    useQueryEmergencyActivationsClient(dataVariables);

  React.useEffect(() => {
    if (userRedux._id !== '' && nfcSerial) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: userRedux._id,
        idGas: userRedux.idGas,
        idVehicle: userRedux._id,
        plates: nfcSerial,
      }));
    } else if (
      userRedux._id &&
      plates !== '' &&
      plates !== 'plates' &&
      !nfcSerial
    ) {
      setDataVariables((oldData: any) => ({
        ...oldData,
        id: userRedux._id,
        idGas: userRedux.idGas,
        idVehicle: userRedux._id,
        plates,
      }));
    }
  }, [userRedux, infoVehicle, nfcSerial, plates]);

  React.useEffect(() => {
    if (dataVariables.idGas !== '') {
      refetch();
      updateProp('writable', false);
    }
  }, [dataVariables]);

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setInfoVehicle(props.route.params.item);
      setPlates(props.route.params.item.plates);
    } else if (props?.route?.params) {
      setInfoVehicle(false);
    } else if (currentPlates.plates) {
      setPlates(currentPlates.plates);
      setInfoVehicle(true);
    }
  }, [props]);

  React.useEffect(() => {
    switchSession(true);
    updateProp('writable', true);
    setNfcSerial(false);
    return () => {
      client.removeQueries({queryKey: ['getEmergencyVehicleResolver']});
      updateProp('writable', false);
      setNfcSerial(false);
    };
  }, []);

  const handleGoBack = () => {
    dispatch(currentPlatesAction(''));
    dispatch(routesAction(''));
    navigation.goBack();
    navigation.goBack();
  };

  // Show loading while determining vehicle info
  if (infoVehicle === null || isLoading) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#E91E63" />
            <Text style={styles.loadingText}>Buscando activaciones...</Text>
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
              <Icon name="car-off" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Placas No Encontradas</Text>
            <Text style={styles.errorText}>
              No se encontraron vehículos con{'\n'}las placas proporcionadas.
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={styles.backButtonText}>Volver</Text>
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
          <Icon name="alarm-light" size={36} color="#E91E63" />
        </View>
        <Text style={styles.headerTitle}>Activaciones de Emergencia</Text>
        <Text style={styles.headerSubtitle}>
          {data
            ? 'Selecciona una activación disponible'
            : 'Acerca tu dispositivo al equipo'}
        </Text>
      </View>

      {!data ? (
        /* NFC Prompt */
        <View style={styles.nfcPromptContainer}>
          <View style={styles.nfcCard}>
            <View style={styles.nfcIconContainer}>
              <Icon name="nfc" size={64} color="#E91E63" />
            </View>
            <Text style={styles.nfcTitle}>Lectura NFC</Text>
            <Text style={styles.nfcText}>
              Acerca tu dispositivo al equipo del vehículo para buscar las
              placas automáticamente.
            </Text>

            <View style={styles.nfcBadge}>
              <Icon name="cellphone-nfc" size={18} color="#4CAF50" />
              <Text style={styles.nfcBadgeText}>NFC Activo</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleGoBack}
            activeOpacity={0.8}>
            <Icon name="close" size={20} color="#E53935" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Activations List */
        <View style={styles.listContainer}>
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Icon name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.statusBadgeText}>
              {data.getEmergencyVehicleResolver.total} activaciones disponibles
            </Text>
          </View>

          {enabled ? (
            <View style={styles.flatListContainer}>
              <UsersFlatList
                navigation={props.navigation}
                isFetching={isFetching}
                data={data.getEmergencyVehicleResolver.data}
                limitPerPage={2}
                toScreen={'useemergencyactivation'}
                setDataVariables={setDataVariables}
                dataVariables={dataVariables}
                isEmergencyClient={true}
                totalItems={data.getEmergencyVehicleResolver.total}
              />
            </View>
          ) : (
            <View style={styles.nfcDisabledCard}>
              <Icon name="nfc-off" size={48} color="#FF9800" />
              <Text style={styles.nfcDisabledText}>
                Para usar este módulo, activa el NFC de tu dispositivo.
              </Text>
            </View>
          )}
        </View>
      )}
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
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 24,
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
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
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
    backgroundColor: '#FCE4EC',
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
  listContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
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
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  flatListContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  nfcDisabledCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
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
  nfcDisabledText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
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
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53935',
  },
  cancelButtonTextGray: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default EmergencyDashboard;
