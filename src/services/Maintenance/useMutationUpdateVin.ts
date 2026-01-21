import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation updateInternalVinResolver($variables: TypesKeyFirstEmergency!) {
    updateInternalVinResolver(variables: $variables)
  }
`;
export const useMutationUpdateVin = () => {
  return useGraphQlMutation(TESTMUTATION, 'updateInternalVinResolver', {
    onSuccess: (data: any) => {},
    onError: (data: any) => {},
  });
};
