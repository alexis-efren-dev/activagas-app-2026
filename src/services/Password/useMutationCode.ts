import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';

const TESTMUTATION = gql`
  mutation codeRecoverResolver($variables: TypesCodeRecover!) {
    codeRecoverResolver(variables: $variables)
  }
`;
export const useMutationCode = () => {
  return useGraphQlMutation(TESTMUTATION,'',{});
};

