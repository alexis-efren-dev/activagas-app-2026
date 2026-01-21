import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import dataFormRecover from '../../DataForms/dataFormRecover.json';
import {useMutationCode} from '../../services/Password/useMutationCode';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {makeStyles} from './customStyles/FormLogin';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';

const {width} = Dimensions.get('screen');
interface Props {
  withCode?: boolean;
  cellPhone?: boolean;
}
export const InputsCode = ({withCode = false, cellPhone}: Props) => {
  const {mutate, isPending:isLoading, reset} = useMutationCode();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const buttonInfo = {
    style: makeStyles.stylesButton,
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
  const [values, setValues] = useState({
    inputRef1: '',
    inputRef2: '',
    inputRef3: '',
    inputRef4: '',
    inputRef5: '',
  });
  const [validCodes, setValidCodes] = useState(false);
  const [currentRef, setCurrentRef] = useState<any>('');
  const [extractPhone, setExtractPhone] = useState<any>({});
  const inputRef1: any = useRef<any>(null);
  const inputRef2: any = useRef<any>(null);
  const inputRef3: any = useRef<any>(null);
  const inputRef4: any = useRef<any>(null);
  const inputRef5: any = useRef<any>(null);
  const handlerChange = (e: any) => {
    if (e.length <= 1) {
      setValues({...values, [currentRef]: e});
      if (e.length) {
        if (currentRef === 'inputRef1') {
          inputRef2.current.focus();
        } else if (currentRef === 'inputRef2') {
          inputRef3.current.focus();
        } else if (currentRef === 'inputRef3') {
          inputRef4.current.focus();
        } else if (currentRef === 'inputRef4') {
          inputRef5.current.focus();
        } else if (currentRef === 'inputRef5') {
          inputRef5.current.blur();
        }
      }
    }
  };
  const handlerFocus = (e: any) => {
    setCurrentRef(e._dispatchInstances.memoizedProps.nativeID);
  };
  const handlePressSingle = () => {
    const getValues = Object.values(values);
    const parsedCode = getValues.join('');
    if (
      isNaN(Number(cellPhone)) ||
      String(cellPhone).indexOf('.') > -1 ||
      isNaN(Number(parsedCode)) ||
      String(parsedCode).indexOf('.') > -1
    ) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError:
            'Formato de telefono o codigo es incorrecto, debe ser numerico',
          showError: true,
        }),
      );
    } else {
      mutate({
        code: Number(parsedCode),
        cellPhone: Number(cellPhone),
      });
      reset();
    }
  };
  const handleWithCode = () => {
    const getValues = Object.values(values);
    const parsedCode = getValues.join('');
    if (
      isNaN(Number(extractPhone.cellPhone)) ||
      String(extractPhone.cellPhone).indexOf('.') > -1 ||
      isNaN(Number(parsedCode)) ||
      String(parsedCode).indexOf('.') > -1
    ) {
      dispatch(
        getAlertSuccess({
          message: '',
          show: false,
          messageError:
            'Formato de telefono o codigo es incorrecto, debe ser numerico',
          showError: true,
        }),
      );
    } else {
      mutate({
        code: Number(parsedCode),
        cellPhone: Number(extractPhone.cellPhone),
      });
      reset();
    }
  };
  useEffect(() => {
    const getValidCodes = Object.values(values);
    let validator = 1;
    for (let i = 0; i < getValidCodes.length; i++) {
      if (getValidCodes[i] === '') {validator = 0;}
    }

    if (withCode) {
      if (
        extractPhone.cellPhone?.length < 8 ||
        !extractPhone.cellPhone ||
        validator === 0
      ) {
        setValidCodes(false);
      } else {
        setValidCodes(true);
      }
    } else {
      if (validator === 1) {
        setValidCodes(true);
      } else {
        setValidCodes(false);
      }
    }
  }, [JSON.stringify(values), extractPhone]);

  return (
    <>
      <View
        style={{flexDirection: 'row', marginVertical: 10, width: width * 0.9}}>
        <TextInput
          value={values.inputRef1}
          onChangeText={handlerChange}
          style={styles.inputs}
          nativeID={'inputRef1'}
          keyboardType="numeric"
          ref={inputRef1}
          onFocus={handlerFocus}
        />
        <TextInput
          value={values.inputRef2}
          onChangeText={handlerChange}
          style={styles.inputs}
          nativeID={'inputRef2'}
          keyboardType="numeric"
          ref={inputRef2}
          onFocus={handlerFocus}
        />
        <TextInput
          value={values.inputRef3}
          onChangeText={handlerChange}
          style={styles.inputs}
          nativeID={'inputRef3'}
          keyboardType="numeric"
          ref={inputRef3}
          onFocus={handlerFocus}
        />
        <TextInput
          value={values.inputRef4}
          onChangeText={handlerChange}
          style={styles.inputs}
          nativeID={'inputRef4'}
          keyboardType="numeric"
          ref={inputRef4}
          onFocus={handlerFocus}
        />
        <TextInput
          value={values.inputRef5}
          onChangeText={handlerChange}
          style={styles.inputs}
          nativeID={'inputRef5'}
          keyboardType="numeric"
          ref={inputRef5}
          onFocus={handlerFocus}
        />
      </View>
      {withCode && (
        <DynamicForm
          cancelLabel={'Cancelar'}
          cancelableAction={() => {
            navigation.navigate('Login');
          }}
          cancelableButton
          cancelableStyle={cancelableStyle}
          extractInfo={setExtractPhone}
          onSubmit={handleWithCode}
          isLoading={isLoading}
          json={dataFormRecover}
          showButton={validCodes}
          labelSubmit="VALIDAR"
          buttonProps={buttonInfo} />
      )}
      {!withCode && (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Login')}
          style={[
            makeStyles.stylesButton,
            {backgroundColor: 'white', marginBottom: 10},
          ]}>
          <Text style={{fontSize: 15, color: 'black'}}>CANCELAR</Text>
        </TouchableWithoutFeedback>
      )}
      {validCodes && !withCode && (
        <TouchableWithoutFeedback
          disabled={isLoading}
          onPress={handlePressSingle}
          style={[
            makeStyles.stylesButton,
            {backgroundColor: '#1F97DC', marginBottom: 10},
          ]}>
          <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>
            VALIDAR
          </Text>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    margin: 2,
    flex: 1,
    textAlign: 'center',
    height: 60,
    backgroundColor: 'white',
  },
});
