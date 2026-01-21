import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation ($variables: TypesEmergencyKey!) {
    registerEmergencyActivationResolver(variables: $variables)
  }
`;
export const useMutationRegisterEmergencyActivations = () => {
  return useGraphQlMutation(
    TESTMUTATION,
    'registerEmergencyActivationResolver',
    {},
  );
};
