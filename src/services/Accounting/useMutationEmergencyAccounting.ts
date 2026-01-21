import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation emergencyActivationAccountingResolver(
    $variables: TypesEmergencyActivationAccounting!
  ) {
    emergencyActivationAccountingResolver(variables: $variables)
  }
`;
export const useMutationEmergencyAccounting = () => {
  return useGraphQlMutation(
    TESTMUTATION,
    'emergencyActivationAccountingResolver',
    {},
  );
};
