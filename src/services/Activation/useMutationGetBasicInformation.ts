import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { dataBasicAction } from '../../redux/states/dataBasicSlice';
import { handlerHceSessionAction } from '../../redux/states/handlerHceSessionSlice';

const TESTMUTATION = gql`
  mutation getVehicleBasicInformationResolver($variables: TypesGetBasic!) {
    getVehicleBasicInformationResolver(variables: $variables) {
      plates
      brand
      model
      cylinders
    }
  }
`;
export const useMutationGetBasicInformation = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(
    TESTMUTATION,
    'getVehicleBasicInformationResolver',
    {
      onSuccess: (data: any, options: any) => {
        data.getVehicleBasicInformationResolver.serialNumber =
          options.serialNumber;
        dispatch(dataBasicAction(data.getVehicleBasicInformationResolver));
        dispatch(handlerHceSessionAction(false));
      },
    },
  );
};
