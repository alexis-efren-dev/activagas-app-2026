import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getHistoryPayResolver($variables: TypesGetHistory!) {
    getHistoryPayResolver(variables: $variables) {
      totalOriginalPrice
      totalPrice
      nextDatePayment
      isComplete
      isDone
      isObligatory
      isOptional
      parsedData
      automaticPayment
      isPaymentInitiated
      amountPaid
      approvedDays
    }
  }
`;
export const useQueryInfoClients = (variables: any) => {
  return useGraphQlQuery(
    'getHistoryPayResolver',
    EDITACTIVATE,
    variables,
    'getHistoryPayResolver',
  );
};
