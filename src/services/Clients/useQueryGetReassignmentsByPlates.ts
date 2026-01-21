import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getReassignmentByPlatesResolver(
    $variables: TypesReassignmentRequestsByPlatesResolver!
  ) {
    getReassignmentByPlatesResolver(variables: $variables) {
      name
      createdAt
      _id
      status
    }
  }
`;
export const useQueryGetReassignmentsByPlates = (variables: any) => {
  return useGraphQlQuery(
    'getReassignmentByPlatesResolver',
    EDITACTIVATE,
    variables,
    'getReassignmentByPlatesResolver',
  );
};
