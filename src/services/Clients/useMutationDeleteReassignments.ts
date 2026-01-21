import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation deleteReassignmentRequestResolver(
    $variables: TypesDeleteReassignmentRequestResolver!
  ) {
    deleteReassignmentRequestResolver(variables: $variables)
  }
`;
export const useMutationDeleteReassignments = () => {
  return useGraphQlMutation(
    TESTMUTATION,
    'deleteReassignmentRequestResolver',
    {},
  );
};
