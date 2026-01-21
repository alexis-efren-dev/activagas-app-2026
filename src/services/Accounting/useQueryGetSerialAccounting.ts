import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
query getKeyResolver($variables: TypesFiltersEditActivatorsResolver!){
    getSerialNumbersAccountingResolver(variables: $variables){total,data{serialNumber,idDevice,_id},total}
}
`;
export const useQueryGetSerialAccounting = (variables:any) => {
    return useGraphQlQuery('getSerialNumbersAccountingResolver',EDITACTIVATE,variables,'getSerialNumbersAccountingResolver');
};
