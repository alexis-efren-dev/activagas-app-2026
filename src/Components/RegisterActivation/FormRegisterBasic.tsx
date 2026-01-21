/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import 'react-native-get-random-values';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {v4 as uuidv4} from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import dataFormBasicUser from '../../DataForms/dataFormRegisterBasicUser.json';
import {useMutationRegister} from '../../services/Register/BasicRegister';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {makeStyles} from '../Login/customStyles/FormLogin';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface IDataRegisterBasic {
  cellPhone: string;
  password: string;
  confirmPassword: string;
}
interface IPros {
  navigation: any;
}
const FormRegisterBasic: React.FC<IPros> = ({navigation}): JSX.Element => {
  const [temporalPass, setTemporalPass] = React.useState<any>('');
  const [visibleError, setVisibleError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const mutation = useMutationRegister();
  const {data, isPending:isLoading} = mutation;
  const handleSubmit = (data: IDataRegisterBasic) => {
    if (
      isNaN(Number(data.cellPhone)) ||
      String(data.cellPhone).indexOf('.') > -1
    ) {
      setErrorMessage('Numero no valido');
      setVisibleError(true);
    } else if (data.password !== data.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setVisibleError(true);
    } else {
      mutation.mutate({
        cellPhone: Number(data.cellPhone),
        idRol: '60fc6def3d097dcce8a1f077',
        password: temporalPass,
      });
    }
  };

  if (data) {
    mutation.reset();
  }

  const buttonInfo = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: '#1C9ADD',
    mode: 'contained',
  };
  React.useEffect(() => {
    setTemporalPass(uuidv4());
  }, []);
  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width,
      }}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{marginTop: 30, flex: 1, alignItems: 'center'}}>
          <ResponsiveImage
            initHeight={height / 6}
            initWidth={width * 0.4}
            resizeMode="contain"
            source={{
              uri: 'https://activagas-files.s3.amazonaws.com/registerInitialIcon.png',
            }}
          />
        </View>
        <View
          style={{
            marginTop: 40,
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
            REGISTRO DE DATOS
          </Text>
        </View>
        <View style={{marginTop: 20, flex: 2}}>
          <DynamicForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            json={dataFormBasicUser}
            labelSubmit="Continuar"
            buttonProps={buttonInfo}>
            <View style={{alignItems: 'center', marginVertical: 20}}>
              <Button
                style={makeStyles.stylesButton}
                mode="contained"
                buttonColor="red"
                onPress={() => navigation.navigate('Register', {})}>
                Cancelar
              </Button>
            </View>
          </DynamicForm>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default FormRegisterBasic;
