import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {useQueryGetMaintenances} from '../../services/Register/useQueryGetMaintenances';
import {useQueryGetServices} from '../../services/Register/useQueryGetServices';
import FormPrevRegister from './FormPrevRegister';
import {IStore} from '../../redux/store';

interface IPropsRegister {
  userSelected: any;
  serialNumber: any;
  navigation: any;
}

const GetPrevServices: React.FC<IPropsRegister> = ({
  serialNumber,
  navigation,
  userSelected,
}): JSX.Element => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const {data, refetch, isLoading: isLoadingServices} = useQueryGetServices({
    idGas: user.idGas,
  });
  const {
    data: dataMaintenances,
    refetch: refetchMaintenances,
    isLoading: isLoadingMaintenances,
  } = useQueryGetMaintenances({idGas: user.idGas});

  const [parsedData, setParsedData] = React.useState<any>([]);
  const [parsedDataMaintenance, setParsedDataMaintenance] = React.useState<any>(
    [],
  );

  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        refetch();
        refetchMaintenances();
        setControllerQuery(true);
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (data) {
      setParsedData(data.getServicesAppResolver.data);
    }
  }, [data]);

  React.useEffect(() => {
    if (dataMaintenances) {
      setParsedDataMaintenance(
        dataMaintenances.getMaintenancesAppResolver.data,
      );
    }
  }, [dataMaintenances]);

  // Show loading state while fetching services
  if (isLoadingServices || isLoadingMaintenances) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando servicios...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // Show loading state while data is being processed
  if (parsedData.length === 0 || parsedDataMaintenance.length === 0) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Preparando formulario...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <FormPrevRegister
      serialNumber={serialNumber}
      idUser={userSelected}
      services={parsedData}
      maintenances={parsedDataMaintenance}
      navigation={navigation}
    />
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
});

export default GetPrevServices;
