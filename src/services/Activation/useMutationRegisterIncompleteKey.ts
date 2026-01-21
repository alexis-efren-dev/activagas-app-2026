import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation ($variables: TypesIncompleteKey!) {
    registerIncompleteKeyResolver(variables: $variables)
  }
`;
export const useMutationRegisterIncompleteKey = () => {
  return useGraphQlMutation(TESTMUTATION, 'registerIncompleteKeyResolver', {});
};
