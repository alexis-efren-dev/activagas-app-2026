/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useRef} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Card} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import dataFormCreateSerial from '../../DataForms/dataFormCreateId.json';
import {useMutationCreateSerialNumber} from '../../services/Stock/useMutationCreateSerialNumber';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {makeStyles} from '../Login/customStyles/FormLogin';
import {useSelector} from 'react-redux';
import useDataLayer from '../../hooks/useDataLayer';
import { IStore } from '../../redux/store';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface IAdd {
  user: any;
  navigation: any;
}

const AddSerialNumber: React.FC<IAdd> = ({user, navigation}): JSX.Element => {
  const [nfcSerial, setNfcSerial] = useState<any>(false);
  const [customJson, setCustomJson] = useState<any>([]);
  const switchSessionRef = useRef<((enable: boolean) => Promise<void>) | null>(null);

  const terminateWriteCallback = useCallback((data: string) => {
    setNfcSerial(['serialNumber', data]);
    if (switchSessionRef.current) {
      switchSessionRef.current(false);
    }
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
  });

  // Keep ref updated with latest switchSession
  switchSessionRef.current = switchSession;

  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);
  const {isPending:isLoading} = useMutationCreateSerialNumber();
  const buttonInfo = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    buttonColor: '#1C9ADD',
    mode: 'contained',
  };
  const handleSubmit = (dataFields: any) => {
    navigation.navigate('VerifyPay', {
      item: user,
      serialNumber: dataFields.serialNumber,
    });
  };
  React.useEffect(() => {
    switchSession(true);
    updateProp('writable', true);
    updateProp('content', 'init');
    setCustomJson([...dataFormCreateSerial]);
    setNfcSerial(['serialNumber', '']);
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
      <KeyboardAwareScrollView
        style={{flex: 1, backgroundColor: 'transparent'}}>
        <View style={{marginTop: 40, width, alignItems: 'center'}}>
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
            ESCANEAR DATOS
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
            {enabled ? (
              <>
                <DynamicForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  json={customJson}
                  labelSubmit="Continuar"
                  buttonProps={buttonInfo}
                  setExtractData={nfcSerial}
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
              </>
            ) : (
              <Text
                style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                PARA HACER USO DE ESTE MODULO, NECESITAS ACTIVAR EL NFC DE TU
                DISPOSITIVO
              </Text>
            )}
          </Card.Content>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
export default AddSerialNumber;
