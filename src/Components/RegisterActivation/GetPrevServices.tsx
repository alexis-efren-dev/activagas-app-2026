import React from 'react';
import {useSelector} from 'react-redux';
import {useQueryGetMaintenances} from '../../services/Register/useQueryGetMaintenances';
import {useQueryGetServices} from '../../services/Register/useQueryGetServices';
import FormPrevRegister from './FormPrevRegister';
import { IStore } from '../../redux/store';
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
    <>
      {parsedData.length > 0 && parsedDataMaintenance.length > 0 ? (
        <FormPrevRegister
          serialNumber={serialNumber}
          idUser={userSelected}
          services={parsedData}
          maintenances={parsedDataMaintenance}
          navigation={navigation}
        />
      ) : null}
    </>
  );
};
export default GetPrevServices;
