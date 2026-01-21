import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useQueryGetMaintenances} from '../../services/Register/useQueryGetMaintenances';
import {useQueryGetServices} from '../../services/Register/useQueryGetServices';
import FormAditionalInfo from './FormAditionalInfo';
import FormRegisterBasic from './FormRegisterBasic';
import { IStore } from '../../redux/store';
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
  const {data, refetch} = useQueryGetServices({idGas: user.idGas});
  const {data: dataMaintenances, refetch: refetchMaintenances} =
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

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
export default FormRegisterActivation;
