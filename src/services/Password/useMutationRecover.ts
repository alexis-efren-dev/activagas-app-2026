import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';

const TESTMUTATION = gql`
  mutation passwordRecoverResolver($variables: TypesPasswordRecover!) {
    passwordRecoverResolver(variables: $variables)
  }
`;
export const useMutationRecover = (setData: Function) => {
  return useGraphQlMutation(TESTMUTATION, '', {
    onSuccess: async () => {
      setData(true);
    },
  });
};
