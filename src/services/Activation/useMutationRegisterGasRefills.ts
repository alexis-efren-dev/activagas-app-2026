import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation ($variables: TypesKey!) {
    registerGasRefillsResolver(variables: $variables)
  }
`;
export const useMutationRegisterGasRefills = () => {
  return useGraphQlMutation(TESTMUTATION, 'registerGasRefillsResolver', {});
};
