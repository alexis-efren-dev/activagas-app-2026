/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Card} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import dataFormCreateSerial from '../../DataForms/dataFormCreateSerial.json';
import {useMutationCreateSerialNumber} from '../../services/Stock/useMutationCreateSerialNumber';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {makeStyles} from '../Login/customStyles/FormLogin';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IAdd {
  user: any;
  serialNumber: any;
  navigation: any;
}

const AddSerialNumber: React.FC<IAdd> = ({
  user,
  navigation,
  serialNumber,
}): JSX.Element => {
  const {mutate, isPending:isLoading} = useMutationCreateSerialNumber();
  const buttonInfo = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: '#1C9ADD',
    mode: 'contained',
  };
  const handleSubmit = (dataFields: any) => {
    mutate({
      idGas: user._id,
      idDevice: serialNumber,
      serialNumber: dataFields.serialNumber,
    });
    dataFields.serialNumber = '';
  };
  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width,
      }}
      colors={['#074169', '#019CDE', '#ffffff']}>
      <KeyboardAwareScrollView
        style={{flex: 1, backgroundColor: 'transparent'}}>
        <View style={{marginTop: 40, alignItems: 'center'}}>
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
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
            INGRESAR DATOS
          </Text>
        </View>
        <View
          style={{
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 17, fontWeight: 'bold'}}>
            GASERA SELECCIONADA: {user.name}
          </Text>
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <Card.Content>
            <DynamicForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              json={dataFormCreateSerial}
              labelSubmit="Crear"
              buttonProps={buttonInfo}
            />
            <View style={{alignItems: 'center'}}>
              <Button
                style={makeStyles.stylesButton}
                mode="contained"
                buttonColor="red"
                onPress={() => {
                  navigation.navigate('Dashboard');
                }}>
                Terminar
              </Button>
            </View>
          </Card.Content>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default AddSerialNumber;
