import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation updateReassignmentRequestResolver(
    $variables: TypesUpdateReassignmentRequestResolver!
  ) {
    updateReassignmentRequestResolver(variables: $variables)
  }
`;
export const useMutationUpdateReassignment = () => {
  return useGraphQlMutation(
    TESTMUTATION,
    'updateReassignmentRequestResolver',
    {},
  );
};
