import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import ActivationValidation from '../../../Components/Activation/ActivationValidation';
import {useQueryGetReadTime} from '../../../services/Configurations/useQueryGetReadTime';
import { IStore } from '../../../redux/store';
interface IPropsRegisterActivation {
  navigation: StackNavigationProp<any, any>;
  route: any;
}
const RegisterActivation: React.FC<IPropsRegisterActivation> = ({
  navigation,
  route,
}): JSX.Element => {
  const [controllerQuery, setControllerQuery] = React.useState<any>(false);
  const [controllerTime, setControllerTime] = React.useState<any>(false);
  const [controllerRender, setControllerRender] = React.useState<any>(false);
  const user = useSelector((store: IStore) => store.loggedUser);
  const {data, refetch} = useQueryGetReadTime({idGas: user.idGas});
  React.useEffect(() => {
    if (user) {
      if (user.idGas !== '' && !controllerQuery) {
        refetch();
        setControllerQuery(true);
      }
    }
  }, [user]);
  React.useEffect(() => {
    if (data) {
      if (data.getReadTimeAppResolver) {
        setControllerTime(Number(data.getReadTimeAppResolver) * 1000);
      }
    }
  }, [data]);

  React.useEffect(() => {
    if (route.params) {
      if (route.params.serialNumber && !controllerRender) {
        setControllerRender(true);
      } else {
        setControllerRender(false);
      }
    }
  }, [route]);
  return (
    <>
      <ActivationValidation
        route={route}
        controllerTime={controllerTime}
        navigation={navigation} />
    </>
  );
};
export default RegisterActivation;
