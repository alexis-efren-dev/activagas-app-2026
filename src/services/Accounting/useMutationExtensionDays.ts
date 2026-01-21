import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation extensionResolver($variables: TypesExtension!) {
    extensionResolver(variables: $variables)
  }
`;
export const useMutationExtensionDays = () => {
  return useGraphQlMutation(TESTMUTATION, 'extensionResolver', {});
};
