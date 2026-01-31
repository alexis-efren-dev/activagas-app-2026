import { GraphQLClient } from 'graphql-request';

import { getApplicationName } from 'react-native-device-info';
import Store from '../redux/store';


export const graphqlRequestNestClient =  (endpointParam: string = '') => {
  const endpoint = endpointParam
    ? endpointParam
    //:'http://192.168.0.18:3000/graphql/'
   : 'https://nest-staging.activagas.com/graphql/';
//   :'https://api.activagas.com/graphql/';

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
