import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation ($variables: DtoInputConfirmationEncrypt!) {
    confirmationEncryptResolver(variables: $variables)
  }
`;
export const useMutationGetEncryptedKey = () => {
  return useGraphQlMutation(TESTMUTATION, 'confirmationEncryptResolver', {
    onSuccess: (_: any) => {},
    onError: (_: any) => {},
  });
};
