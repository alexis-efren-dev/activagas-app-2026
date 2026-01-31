import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';

const GET_MUNICIPALITIES = gql`
  query getMunicipalitiesResolver($variables: TypesFiltersEditActivatorsResolver!) {
    getMunicipalitiesResolver(variables: $variables) {
      data {
        municipality
      }
      total
    }
  }
`;

export interface MunicipalityData {
  municipality: string;
}

export interface GetMunicipalitiesResponse {
  getMunicipalitiesResolver: {
    data: MunicipalityData[];
    total: number;
  };
}

export interface GetMunicipalitiesVariables {
  idGas: string;
  state: string;
  limit?: number;
  current?: number;
  fieldFind?: string;
}

export const useQueryGetMunicipalities = (
  variables: GetMunicipalitiesVariables,
) => {
  return useGraphQlQuery<GetMunicipalitiesResponse, GetMunicipalitiesVariables>(
    `municipalities-${variables.idGas}-${variables.state}-${variables.fieldFind || ''}`,
    GET_MUNICIPALITIES,
    {
      idGas: variables.idGas,
      state: variables.state,
      limit: variables.limit || 100,
      current: variables.current || 1,
      fieldFind: variables.fieldFind || '',
    },
    'getMunicipalitiesResolver',
    {
      enabled: Boolean(variables.idGas) && Boolean(variables.state),
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  );
};
