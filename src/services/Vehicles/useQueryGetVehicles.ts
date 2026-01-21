import gql from 'graphql-tag';
import {createQueryHook} from '../createServiceHooks';
import type {GetVehiclesResolverResponse} from '../../types/graphql';

const QUERY = gql`
  query getVehiclesResolver($variables: TypesGetVehicles!) {
    getVehiclesResolver(variables: $variables) {
      data {
        idGas
        _id
        plates
        model
        serialNumber
        whatsappSupport
        serialPlates
      }
      total
    }
  }
`;

interface GetVehiclesVariables {
  idGas: string;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Query hook for fetching vehicles list
 * Returns typed response with GetVehiclesResolverResponse
 */
export const useQueryGetVehicles = createQueryHook<
  GetVehiclesResolverResponse,
  GetVehiclesVariables
>('getVehiclesResolver', QUERY, 'getVehiclesResolver');
