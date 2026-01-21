import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation registerMaintenanceResolver($variables: TypesRegisterMaintenance!) {
    registerMaintenanceResolver(variables: $variables)
  }
`;
export const useMutationRegisterMaintenance = () => {
  return useGraphQlMutation(TESTMUTATION, 'registerMaintenanceResolver', {});
};
