import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';

const GET_STATES = gql`
  query getStatesResolver($variables: TypesFiltersEditActivatorsResolver!) {
    getStatesResolver(variables: $variables) {
      data {
        state
      }
      total
    }
  }
`;

export interface StateData {
  state: string;
}

export interface GetStatesResponse {
  getStatesResolver: {
    data: StateData[];
    total: number;
  };
}

export interface GetStatesVariables {
  idGas: string;
  limit?: number;
  current?: number;
  fieldFind?: string;
}

export const useQueryGetStates = (variables: GetStatesVariables) => {
  return useGraphQlQuery<GetStatesResponse, GetStatesVariables>(
    `states-${variables.idGas}-${variables.fieldFind || ''}`,
    GET_STATES,
    {
      idGas: variables.idGas,
      limit: variables.limit || 100,
      current: variables.current || 1,
      fieldFind: variables.fieldFind || '',
    },
    'getStatesResolver',
    {
      enabled: Boolean(variables.idGas),
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  );
};
