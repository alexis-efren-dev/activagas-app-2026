import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation requestUpdateClientVehicleResolver($variables: TypesTypesEditi!) {
    requestUpdateClientVehicleResolver(variables: $variables)
  }
`;
export const useMutationRequestUpdateVehicle = () => {
  return useGraphQlMutation(
    TESTMUTATION,
    'requestUpdateClientVehicleResolver',
    {},
  );
};
