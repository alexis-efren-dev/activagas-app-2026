import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getSignedImagesResolver($variables: TypesGetSignedImages!) {
    getSignedImagesResolver(variables: $variables) {
      urlPlates
      urlCirculation
      urlVideo
      urlTank
      urlVin
      urlPC
    }
  }
`;
export const useQueryGetSignedImages = (variables: any) => {
  return useGraphQlQuery(
    'getSignedImagesResolver',
    EDITACTIVATE,
    variables,
    'getSignedImagesResolver',
  );
};
