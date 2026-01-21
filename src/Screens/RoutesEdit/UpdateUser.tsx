/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Button, IconButton, Switch, Title} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useDispatch, useSelector} from 'react-redux';
import {DynamicForm} from '../../Components/DynamicForms/DynamicForm';
import {makeStyles} from '../../Components/Login/customStyles/FormLogin';
import dataFormEditUser from '../../DataForms/dataFormEditUser.json';
import {useMutationEditToClient} from '../../services/Accounting/useMutationEditToClient';
import {useQueryGetInfoToEdit} from '../../services/Accounting/useQueryGetInfoToEdit';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';
import { IStore } from '../../redux/store';
const {width, height} = Dimensions.get('screen');
const buttonInfo = {
  style: makeStyles.stylesButton,
  contentStyle: makeStyles.stylesButtonContent,
  buttonColor: '#1C9ADD',
  mode: 'contained',
};
const UpdateUser = (props: any) => {
  const [user, setUser] = React.useState<any>(false);
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const dispatch = useDispatch();
  const dispatchErrors = (message: string) => {
    dispatch(
      getAlertSuccess({
        message: '',
        show: false,
        messageError: message,
        showError: true,
      }),
    );
  };
  const [dataVariables, setDataVariables] = React.useState<any>(false);
  const [isWithWhatsapp, setIsWithWhatsapp] = React.useState<boolean>(false);
  const onWithWhatsapp = () => setIsWithWhatsapp(!isWithWhatsapp);
  const [parsedJson, setParsedJson] = React.useState<any>(false);
  const {data, error, isLoading, refetch, isFetching} =
    useQueryGetInfoToEdit(dataVariables);
  const {isPending: isLoadingMutation, mutate} = useMutationEditToClient();
  React.useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.user) {
            setUser(props.route.params.user);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);
  React.useEffect(() => {
    if (user && userRedux) {
      setDataVariables({
        idGas: userRedux.idGas,
        cellPhone: user.cellPhone,
      });
    }
  }, [user, userRedux]);

  React.useEffect(() => {
    if (dataVariables) {
      refetch();
    }
  }, [dataVariables]);

  React.useEffect(() => {
    if (data && data.getInfoToEditUserResolver) {
      const transformJson = JSON.stringify(dataFormEditUser);
      const revertJson = JSON.parse(transformJson);
      const parsedData = data.getInfoToEditUserResolver;
      const getKeys = Object.keys(parsedData);
      for (let i = 0; i < revertJson.length; i++) {
        if (getKeys.includes(revertJson[i].name)) {
          revertJson[i].value = String(parsedData[revertJson[i].name]);
        }
      }
      setIsWithWhatsapp(parsedData.whatsapp);

      setParsedJson(revertJson);
    }
  }, [data]);

  if (user === '' || error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton
          icon="water-boiler-alert"
          iconColor={'black'}
          size={80}
          onPress={() => props.navigation.goBack()}
        />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }
  if (isLoading || isFetching) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  const handlerSubmit = (dataToUpdate: any) => {
    if (dataToUpdate.password !== dataToUpdate.confirmPassword) {
      dispatchErrors('Las contraseñas deben ser iguales');
    } else {
      mutate({
        idGas: userRedux.idGas,
        _id: data.getInfoToEditUserResolver._id,
        cellPhone: Number(dataToUpdate.cellPhone),
        password: dataToUpdate.password,
        state: dataToUpdate.state,
        municipality: dataToUpdate.municipality,
        location: dataToUpdate.location,
        firstName: dataToUpdate.firstName,
        lastName: dataToUpdate.lastName,
        email: dataToUpdate.email,
        whatsapp: isWithWhatsapp,
      });
    }
  };
  return (
    <LinearGradient
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{flex: 1, marginTop: 35, alignItems: 'center'}}>
          <ResponsiveImage
            initHeight={height / 4}
            resizeMode="contain"
            initWidth={width * 0.7}
            source={{
              uri: 'https://activagas-files.s3.amazonaws.com/userwithedit.png',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
            EDITAR USUARIO
          </Text>
        </View>
        {parsedJson ? (
          <View style={{flex: 2}}>
            <DynamicForm
              onSubmit={handlerSubmit}
              isLoading={isLoadingMutation}
              json={parsedJson}
              labelSubmit="Actualizar"
              buttonProps={buttonInfo}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexDirection: 'row',
                }}>
                <Text style={{color: '#fff', fontSize: 20, marginRight: 10}}>
                  Whatsapp
                </Text>
                <Switch value={isWithWhatsapp} onValueChange={onWithWhatsapp} color="#1C9ADD"/>
              </View>
              <View style={{alignItems: 'center'}}>
                <Button
                  style={makeStyles.stylesButton}
                  mode="contained"
                  buttonColor="#1C9ADD"
                  onPress={() => props.navigation.goBack()}>
                  CANCELAR
                </Button>
              </View>
            </DynamicForm>
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default UpdateUser;
