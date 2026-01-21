import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {useMutationLogin} from '../../services/Login/Login';
import {InputsCode} from './InputsCode';
import { activeSessionAction } from '../../redux/states/activeSessionState';
const {width} = Dimensions.get('screen');
interface Props {
  withCode?: boolean;
  cellPhone?: any;
}
export const FormCode: React.FC<Props> = React.memo(
  ({withCode = false, cellPhone = false}): JSX.Element => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const mutation = useMutationLogin();
    const {data, isError} = mutation;

    React.useEffect(() => {
      if (data && !isError) {
        dispatch(activeSessionAction({active: data.loginV2Resolver.token}));
      }
    }, [data, isError, dispatch]);

    return (
      <>
        <InputsCode withCode={withCode} cellPhone={cellPhone} />
        <View
          style={{
            width: width * 0.9,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Text
            onPress={() => navigation.navigate('Recover')}
            style={{
              color: '#1F97DC',
              fontSize: 15,
              fontWeight: 'bold',
              marginVertical: 5,
            }}>
            Solicitar nuevo codigo
          </Text>
        </View>
      </>
    );
  },
);
