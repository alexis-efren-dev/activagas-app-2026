import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
mutation updateNextVerificationResolver($variables:TypesUpdateNextVerification!){
    updateNextVerificationResolver(variables: $variables)
  }
`;
export const useMutationUpdateNextVerification = () => {
  return useGraphQlMutation(TESTMUTATION,'updateNextVerificationResolver',{

  });
};
