import { GraphQLClient } from 'graphql-request';

import { getApplicationName } from 'react-native-device-info';
import Store from '../redux/store';


export const graphqlRequestNestClient =  (endpointParam: string = '') => {
  const endpoint = endpointParam
    ? endpointParam
    : 'https://nest-staging.activagas.com/graphql/';

const token = Store.getState().authToken.token;
  const headers: any = {
    headers: {
      authorizationToken: token,
      originApp: getApplicationName(),
    },
  };
  const graphQLRequest = new GraphQLClient(endpoint, headers);
  return graphQLRequest;
};
