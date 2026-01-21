import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
mutation createSerialNumberResolver($variables:TypesSerialNumber!){
    createSerialNumberResolver(variables: $variables)
  }
`;
export const useMutationCreateSerialNumber = () => {
  return useGraphQlMutation(TESTMUTATION,'createSerialNumberResolver',{

  });
};
