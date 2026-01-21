import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation updateClientResolver($variables: TypesUpdateClient!) {
    updateClientResolver(variables: $variables)
  }
`;
export const useMutationEditToClient = () => {
  return useGraphQlMutation(TESTMUTATION, 'updateClientResolver', {});
};
