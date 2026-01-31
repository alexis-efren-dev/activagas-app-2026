import gql from 'graphql-tag';
import {createQueryHook} from '../createServiceHooks';
import type {GetClientsResolverResponse} from '../../types/graphql';

const QUERY = gql`
  query getClientsResolver($variables: TypesFiltersEditActivatorsResolver!) {
    getClientsResolver(variables: $variables) {
      data {
        firstName
        _id
        cellPhone
        idClientSigned
      }
      total
    }
  }
`;

interface GetClientsVariables {
  idGas: string;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Query hook for fetching clients list
 * Returns typed response with GetClientsResolverResponse
 */
export const useQueryGetClients = createQueryHook<
  GetClientsResolverResponse,
  GetClientsVariables
>('getClientsResolver', QUERY, 'getClientsResolver');
