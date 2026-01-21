import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
query getHistoryMaintenanceResolver($variables: TypesGetHistoryMaintenances!){
    getHistoryMaintenanceResolver(variables: $variables){
        isDone,
        isObligatory,
        isOptional,
        nextMaintenance,
        parsedData
    }
}
`;
export const useQueryGetInfoMaintenance = (variables:any) => {
    return useGraphQlQuery('getHistoryMaintenanceResolver',EDITACTIVATE,variables,'getHistoryMaintenanceResolver');
};
