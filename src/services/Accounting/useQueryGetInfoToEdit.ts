import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
query getKeyResolver($variables: TypesGetINfoToEdit!){
    getInfoToEditUserResolver(variables: $variables){
        _id,
        cellPhone,
        state,
        municipality,
        location,
        firstName,
        lastName,
        email,
        whatsapp
    }
}
`;
export const useQueryGetInfoToEdit = (variables:any) => {
    return useGraphQlQuery('getInfoToEditUserResolver',EDITACTIVATE,variables,'getInfoToEditUserResolver');
};
