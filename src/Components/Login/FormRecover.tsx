import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from './customStyles/FormLogin';
import {IDataLogin} from './types';

import {useNavigation} from '@react-navigation/native';
import {Dimensions, Text, View} from 'react-native';
import dataFormRecover from '../../DataForms/dataFormRecover.json';
import {useMutationRecover} from '../../services/Password/useMutationRecover';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';
const {width} = Dimensions.get('screen');
export const FormRecover: React.FC = React.memo((): JSX.Element => {
  const [dataSuccess, setDataSuccess] = useState(false);
  const [cellPhoneToSend, setCellPhoneToSend] = useState(0);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const mutation = useMutationRecover(setDataSuccess);
  const {isPending: isLoading, reset} = mutation;
  const handleSubmit = (dataLogin: IDataLogin) => {
    const {cellPhone} = dataLogin;
    if (isNaN(Number(cellPhone)) || String(cellPhone).indexOf('.') > -1) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError: 'Formato de telefono es incorrecto, debe ser numerico',
          showError: true,
        }),
      );
    } else {
      setCellPhoneToSend(Number(cellPhone));
      mutation.mutate({
        cellPhone: Number(cellPhone),
      });
    }

    // navigation.navigate('RecoverCode');
  };

  const buttonInfo = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: '#1F97DC',
    mode: 'contained',
  };
  const cancelableStyle = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: 'red',
    mode: 'contained',
  };
  useEffect(() => {
    if (dataSuccess) {
      setDataSuccess(false);
      reset();
      navigation.navigate('RecoverCode', {
        cellPhone: cellPhoneToSend,
      });
      setCellPhoneToSend(0);
    }
  }, [dataSuccess]);
  return (
    <>
      <DynamicForm
        cancelLabel={'Cancelar'}
        cancelableAction={() => {
          navigation.navigate('Login');
        }}
        cancelableButton
        cancelableStyle={cancelableStyle}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        json={dataFormRecover}
        labelSubmit="Solicitar"
        buttonProps={buttonInfo}>
        <View
          style={{
            width: width * 0.9,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Text
            onPress={() => navigation.navigate('RecoverCode', {haveCode: true})}
            style={{color: '#1F97DC', fontSize: 15, fontWeight: 'bold'}}>
            Tengo el codigo
          </Text>
        </View>
      </DynamicForm>
    </>
  );
});
