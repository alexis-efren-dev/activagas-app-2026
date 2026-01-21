import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
mutation getAlertToShowResolver($variables: TypesAlertShow!){
    getAlertToShowResolver(variables: $variables)
}
`;
export const useMutationAlertResolver = () => {
  return useGraphQlMutation(TESTMUTATION,'getAlertToShowResolver',{

        onSuccess:()=>{

        },

   });
};
