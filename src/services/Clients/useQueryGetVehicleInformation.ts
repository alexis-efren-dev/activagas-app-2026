import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
query readUserByResolver($variables: TypesReadUser!){
    readUserByResolver(variables: $variables){nextActivation,dataVehicle{brand,model,plates,},policies{
        financing {
            nextDatePayment,
            finalDateToPay,
            typeService,
            name,
            paymentOptional,
            limitPay,
            frequencySelected,
            totalOriginalPrice,
            totalPrice
        }
        maintenance {
            frequencySelected,
            typeService,
            nextMaintenance,
            name,
            maintenanceOptional
        }
        policies

        verification{
            nextVerification
            isNaturalGas
            lastVerification
        }
    }
    }
}
`;
export const useQueryGetVehicleInformation = (variables:any) => {
    return useGraphQlQuery('readUserByResolver',EDITACTIVATE,variables,'readUserByResolver');
};
