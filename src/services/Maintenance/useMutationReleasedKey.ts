import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation ($variables: DtoInputConfirmationEncrypt!) {
    liberationEncryptResolver(variables: $variables)
  }
`;
export const useMutationReleasedKey = () => {
  return useGraphQlMutation(TESTMUTATION, 'liberationEncryptResolver', {
    onSuccess: (_: any) => {},
    onError: (_: any) => {},
  });
};
