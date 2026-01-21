import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
query getDateVerificationResolver($variables: TypesGetVeriVeri!){
    getDateVerificationResolver(variables: $variables){
        date,
        expired
    }
}
`;
export const useQueryGetVerificationData = (variables:any) => {
    return useGraphQlQuery('getDateVerificationResolver',EDITACTIVATE,variables,'getDateVerificationResolver');
};
