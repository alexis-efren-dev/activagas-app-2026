import { GraphQLClient } from 'graphql-request';

import { getApplicationName } from 'react-native-device-info';
import Store from '../redux/store';


export const graphqlRequestClient =  (endpointParam: string = '') => {
  const endpoint = endpointParam
    ? endpointParam
    :'https://nest-staging.activagas.com/graphql/';
    //:'http://192.168.0.18:3000/graphql/'   
     // : 'https://api.activagas.com/graphql/';

const tokete = Store.getState().authToken.token;
  const headers: any = {
    headers: {
      authorization: tokete,
      originApp: getApplicationName(),
    },
  };
  const graphQLRequest = new GraphQLClient(endpoint, headers);
  return graphQLRequest;
};
