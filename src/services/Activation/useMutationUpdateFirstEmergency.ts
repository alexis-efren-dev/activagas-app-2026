import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation updateFirstEmergencyResolver($variables: TypesKeyFirstEmergency!) {
    updateFirstEmergencyResolver(variables: $variables)
  }
`;
export const useMutationUpdateFirstEmergency = () => {
  return useGraphQlMutation(TESTMUTATION, 'updateFirstEmergencyResolver', {});
};
