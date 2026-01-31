import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useQueryGetMaintenances} from '../../services/Register/useQueryGetMaintenances';
import {useQueryGetServices} from '../../services/Register/useQueryGetServices';
import FormAditionalInfo from './FormAditionalInfo';
import FormRegisterBasic from './FormRegisterBasic';
import {IStore} from '../../redux/store';

interface IPropsRegister {
  serialNumber: any;
  navigation: any;
}

const FormRegisterActivation: React.FC<IPropsRegister> = ({
  serialNumber,
  navigation,
}): JSX.Element => {
  const {validation} = useSelector(
    (store: IStore) => store.handlerFormRegister,
  );
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const {data, refetch, isLoading: isLoadingServices} = useQueryGetServices({idGas: user.idGas});
  const {data: dataMaintenances, refetch: refetchMaintenances, isLoading: isLoadingMaintenances} =
    useQueryGetMaintenances({idGas: user.idGas});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Show loading while fetching services for step 2
  // Only wait for services - maintenances query might fail and that's ok
  if (validation && (isLoadingServices || parsedData.length === 0)) {
    return (
      <LinearGradient style={styles.loadingContainer} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator animating={true} color="#1C9ADD" size="large" />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {parsedData.length > 0 && validation ? (
        <FormAditionalInfo
          serialNumber={serialNumber}
          idUser={{validation}}
          services={parsedData}
          maintenances={parsedDataMaintenance}
          navigation={navigation}
        />
      ) : (
        <FormRegisterBasic navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
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
  },
});

export default FormRegisterActivation;
