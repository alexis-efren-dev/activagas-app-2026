import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Paragraph,
  Title,
} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import dataFormActivation from '../../DataForms/dataFormActivation.json';
import dataFormExtension from '../../DataForms/dataFormExtension.json';
import {useMutationEmergencyAccounting} from '../../services/Accounting/useMutationEmergencyAccounting';
import {useMutationExtensionDays} from '../../services/Accounting/useMutationExtensionDays';
import {useQueryInfoClients} from '../../services/Clients/useQueryInfoClients';
import AlertEmergency from '../Alerts/AlertEmergency';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {makeStyles} from '../Login/customStyles/FormLogin';
import { IStore } from '../../redux/store';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IUser {
  user: any;
  navigation: StackNavigationProp<any, any>;
  cancelAction?: any;
}
const UserInfo: React.FC<IUser> = ({
  user,
  navigation,
  cancelAction = () => {},
}) => {
  const buttonInfo = {
    style: {width: width / 2, marginTop: 10}, // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: '#1C9ADD',
    mode: 'contained',
  };
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [handlerAlert, setHandlerAlert] = React.useState<any>(false);
  const [isEmergency, setIsEmergency] = React.useState<any>(false);
  const [isExtension, setIsExtension] = React.useState<any>(false);
  const [parsedInfo, setParsedInfo] = React.useState<any>(false);
  const [dataVariables, setDataVariables] = React.useState<any>({
    idGas: '',
    idAditionalClient: '',
  });
  const {data, refetch, isLoading, isError} =
    useQueryInfoClients(dataVariables);
  const {
    mutate: mutateForEmergency,
    isPending: isLoadMutation,
  } = useMutationEmergencyAccounting();

  const {mutate: mutateExtension, isPending: isLoadingExtension} =
    useMutationExtensionDays();

  React.useEffect(() => {
    if (user && userRedux) {
      if (user._id && userRedux.idGas !== '') {
        setDataVariables({
          idGas: userRedux.idGas,
          idAditionalClient: user._id,
        });
      }
    }
  }, [user, userRedux]);
  React.useEffect(() => {
    if (dataVariables.idGas !== '' && dataVariables.idAditionalClient !== '') {
      refetch();
    }
  }, [dataVariables]);
  React.useEffect(() => {
    if (data) {
      setParsedInfo(data.getHistoryPayResolver);
    }
  }, [data]);

  if (isLoading || isLoadMutation) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }
  return (
    <>
      {handlerAlert ? (
        <AlertEmergency
          navigation={navigation}
          show={setHandlerAlert}
          user={userRedux} />
      ) : null}

      <LinearGradient
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        colors={['#074169', '#019CDE', '#ffffff']}>
        <ScrollView>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: 1, marginTop: 30}}>
              <ResponsiveImage
                initHeight={height / 5}
                initWidth={width * 0.4}
                resizeMode="contain"
                source={{
                  uri: 'https://activagas-files.s3.amazonaws.com/userinformation.png',
                }} />
            </View>

            <View
              style={{
                flex: 1,
                width: width / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                INFORMACION
              </Text>
            </View>

            <View style={{flex: 2}}>
              {parsedInfo ? (
                <>
                  {isEmergency ? (
                    <DynamicForm
                      onSubmit={(data: any) => {
                        mutateForEmergency({
                          idGas: userRedux.idGas,
                          idVehicle: user._id,
                          daysToActivate: Number(data.daysToActivate),
                        });
                      }}
                      isLoading={isLoading}
                      json={dataFormActivation}
                      labelSubmit="Activar"
                      buttonProps={buttonInfo}>
                      <View style={{alignItems: 'center'}}>
                        <Button
                          style={{marginTop: 10, width: width / 2}}
                          mode="contained"
                          buttonColor="#1C9ADD"
                          onPress={() => {
                            setIsEmergency(false);
                          }}>
                          Regresar
                        </Button>
                      </View>
                    </DynamicForm>
                  ) : isExtension ? (
                    <DynamicForm
                      onSubmit={(data: any) => {
                        if (!isNaN(Number(data.daysToExtend))) {
                          mutateExtension({
                            idGas: userRedux.idGas,
                            idVehicle: user._id,
                            daysToExtension: Number(data.daysToExtend),
                          });
                        }
                      }}
                      isLoading={isLoadingExtension}
                      json={dataFormExtension}
                      labelSubmit="Agregar"
                      buttonProps={buttonInfo}>
                      <View style={{alignItems: 'center'}}>
                        <Button
                          style={{marginTop: 10, width: width / 2}}
                          mode="contained"
                          buttonColor="#1C9ADD"
                          onPress={() => {
                            setIsExtension(false);
                          }}>
                          Regresar
                        </Button>
                      </View>
                    </DynamicForm>
                  ) : (
                    <Card.Content>
                      {!parsedInfo.isOptional &&
                      !parsedInfo.isObligatory &&
                      !parsedInfo.isDone ? (
                        <Paragraph
                          style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '500',
                          }}>
                          El equipo con placas {user.plates} y modelo{' '}
                          {user.model} fue adquirido con un precio de{' '}
                          {`$${parsedInfo.totalOriginalPrice}`} de los cuales ha
                          pagado {`$${parsedInfo.totalPrice}`} la siguiente
                          fecha de pago es el dia {parsedInfo.parsedData} y por
                          tanto no es obligatorio pagar en estos momentos, pero
                          puede hacerlo si asi lo desea.
                        </Paragraph>
                      ) : null}

                      {!parsedInfo.isOptional &&
                      parsedInfo.isObligatory &&
                      !parsedInfo.isDone ? (
                        <Paragraph
                          style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '500',
                          }}>
                          El equipo con placas {user.plates} y modelo{' '}
                          {user.model} fue adquirido con un precio de{' '}
                          {`$${parsedInfo.totalOriginalPrice}`} de los cuales ha
                          pagado {`$${parsedInfo.totalPrice}`} la siguiente
                          fecha de pago fue el dia {parsedInfo.parsedData} y por
                          tanto es obligatorio pagar, reportar pago a la
                          brevedad.
                        </Paragraph>
                      ) : null}

                      {parsedInfo.isComplete || parsedInfo.isOptional ? (
                        <View style={{height: height / 2}}>
                          <View style={{marginVertical: 30}}>
                            <Paragraph
                              style={{
                                color: 'white',
                                fontSize: 15,
                                fontWeight: '500',
                              }}>
                              El equipo con placas {user.plates} y modelo{' '}
                              {user.model} se ha terminado de pagar.
                            </Paragraph>
                          </View>
                          <View style={{flex: 1}} />
                          <View style={{width: width * 0.9}}>
                            <IconButton
                              icon="arrow-left-bold"
                              iconColor="#1C9ADD"
                              size={50}
                              onPress={() => navigation.goBack()}
                            />
                          </View>
                        </View>
                      ) : null}

                      {!parsedInfo.isOptional && !parsedInfo.isComplete ? (
                        <>
                          <Button
                            style={{marginTop: 10}}
                            mode="contained"
                            buttonColor="#1C9ADD"
                            onPress={() => {
                              const allInfo = {
                                infoData: {...user},
                                paymentData: {...parsedInfo},
                              };
                              navigation.navigate('FormPay', {
                                user: allInfo,
                              });
                            }}>
                            Registrar Pago
                          </Button>

                          <Button
                            style={{marginTop: 10}}
                            mode="contained"
                            buttonColor="#1C9ADD"
                            onPress={() => {
                              setIsEmergency(true);
                            }}>
                            Activacion de emergencia
                          </Button>

                          <Button
                            style={{marginTop: 10}}
                            mode="contained"
                            buttonColor="#1C9ADD"
                            onPress={() => {
                              setIsExtension(true);
                            }}>
                            Extension de dias
                          </Button>
                        </>
                      ) : null}

                      <Button
                        style={{marginTop: 10}}
                        mode="contained"
                        buttonColor="red"
                        onPress={() => {
                          cancelAction();
                        }}>
                        Cancelar
                      </Button>
                    </Card.Content>
                  )}
                </>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};
export default UserInfo;
//
