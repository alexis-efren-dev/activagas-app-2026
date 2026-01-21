/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import UserInfo from '../../Components/Accounting/UserInfo';
import { DynamicForm } from '../../Components/DynamicForms/DynamicForm';
import { makeStyles } from '../../Components/Login/customStyles/FormLogin';
import UserInfoMaintenance from '../../Components/Maintenance/UserInfo';
import dataForm from '../../DataForms/dataFormPlates.json';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';
import { IStore } from '../../redux/store';
import { useQuerySearchPlates } from '../../services/Accounting/useQuerySearchPlates';
import { customTypeError } from '../../utils/customTypeError';
interface Props {
  plates: string;
}
const buttonInfo = {
  style: makeStyles.stylesButton,
  contentStyle: makeStyles.stylesButtonContent,
  buttonColor: '#fff',
  textColor: 'black',
  mode: 'contained',
};

const HomeGenericPlates = (props: any) => {
  const dispatch = useDispatch();
  const [handlerUserInfo, setHandlerUserInfo] = useState<any>(false);
  const client = useQueryClient();
  const {idGas} = useSelector((store: IStore) => store.loggedUser);
  const [dataVariables, setDataVariables] = useState({
    idGas,
    plates: '',
  });
  const {isLoading, refetch} = useQuerySearchPlates(dataVariables);
  const handleSubmit = (data: Props) => {
    if (props.verification) {
      setDataVariables({
        ...dataVariables,
        plates: data.plates,
        idGas: props.verification,
      });
    } else {
      setDataVariables({
        ...dataVariables,
        plates: data.plates,
      });
    }
  };
  const refetchData = async () => {
    try {
      const response: any = await refetch();
      if (!response.data) {
        dispatch(
          getAlertSuccess({
            message: customTypeError(response.error),
            show: true,
            messageError: '',
            showError: false,
          }),
        );
        return;
      }
      setHandlerUserInfo(response.data.searchPlatesResolver);
    } catch (e:any) {
      dispatch(
        getAlertSuccess({
          message: 'Error al obtener',
          show: true,
          messageError: '',
          showError: false,
        }),
      );
    }
  };
  useEffect(() => {
    if (dataVariables.plates !== '') {
      refetchData();
    }
  }, [dataVariables]);

  useEffect(() => {
    if (handlerUserInfo) {
      client.removeQueries({queryKey: ['searchPlatesResolver']});
      if (props.verification) {
        props.navigation.navigate('VerifyUnit', {
          item: handlerUserInfo,
        });
      }
    }
  }, [handlerUserInfo]);
  useEffect(() => {
    if (props.refresh) {
      setHandlerUserInfo(false);
    }
  }, [props]);

  if (handlerUserInfo) {
    if (props.accounting) {
      return (
        <UserInfo
          cancelAction={() => setHandlerUserInfo(false)}
          user={handlerUserInfo}
          navigation={props.navigation}
        />
      );
    } else if (!props.accounting && !props.verification) {
      return (
        <UserInfoMaintenance
          cancelAction={() => setHandlerUserInfo(false)}
          user={handlerUserInfo}
          navigation={props.navigation}
        />
      );
    }
  }

  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <DynamicForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        json={dataForm}
        labelSubmit="Buscar"
        buttonProps={buttonInfo}
      />
      {!!props.verification && (
        <Button
          style={{marginTop: 10}}
          mode="contained"
          color="red"
          onPress={() => {
            props.navigation.goBack();
          }}>
          Cancelar
        </Button>
      )}
    </LinearGradient>
  );
};

export default HomeGenericPlates;
