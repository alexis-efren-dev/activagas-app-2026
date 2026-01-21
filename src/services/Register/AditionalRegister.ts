import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation registerClientResolver($variables: TypesRegisterClient!) {
    registerClientResolver(variables: $variables)
  }
`;
export const useMutationAditionalRegister = () => {
  return useGraphQlMutation(TESTMUTATION, 'registerClientResolver', {});
};
