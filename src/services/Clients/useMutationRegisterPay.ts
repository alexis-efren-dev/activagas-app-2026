import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
  mutation registerPaymentResolver($variables: TypesRegisterPayment!) {
    registerPaymentResolver(variables: $variables)
  }
`;
export const useMutationRegisterPay = () => {
  return useGraphQlMutation(TESTMUTATION, 'registerPaymentResolver', {});
};
