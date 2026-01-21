/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Card} from 'react-native-paper';
import ResponsiveImage from 'react-native-responsive-image';
import {useSelector} from 'react-redux';
import {DynamicForm} from '../../../Components/DynamicForms/DynamicForm';
import {makeStyles} from '../../../Components/Login/customStyles/FormLogin';
import UserInfoMaintenance from '../../../Components/Maintenance/UserInfo';
import dataFormCreateSerial from '../../../DataForms/dataFormCreateId.json';
import useDataLayer from '../../../hooks/useDataLayer';
import {IStore} from '../../../redux/store';
import {useQuerySearchBySerialId} from '../../../services/Accounting/useQuerySearchBySerialId';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const AddSerialNumber = (props: any): JSX.Element => {
  const {idGas} = useSelector((store: IStore) => store.loggedUser);
  const {content} = useSelector((store: IStore) => store.handlerNfcMaintenance);
  const {
    data: dataMutation,
    mutate,
    isPending: isLoading,
    reset,
  } = useQuerySearchBySerialId();
  const [nfcSerial, setNfcSerial] = useState<any>(false);
  const [customJson, setCustomJson] = useState<any>([]);
  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: (data: string) => {
      if (data) {
        setNfcSerial(['serialNumber', data]);
        switchSession(false);
      }
    },
  });
  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);

  const buttonInfo = {
    style: makeStyles.stylesButton,
    // icon: 'arrow-right-bold',
    contentStyle: makeStyles.stylesButtonContent,
    color: 'white',
    mode: 'contained',
  };
  const handleSubmit = (dataFields: any) => {
    mutate({
      plates: dataFields.serialNumber,
      idGas,
    });
  };
  React.useEffect(() => {
    if (content !== '') {
      switchSession(true);
      updateProp('writable', true);
      updateProp('content', 'init');
      setCustomJson([...dataFormCreateSerial]);
      setNfcSerial(['serialNumber', '']);
    }
  }, [content]);
  React.useEffect(() => {
    if (!dataMutation) {
      switchSession(true);
      updateProp('writable', true);
      updateProp('content', 'init');
      setCustomJson([...dataFormCreateSerial]);
      setNfcSerial(['serialNumber', '']);
    }
  }, [dataMutation]);

  return (
    <>
      {dataMutation ? (
        <UserInfoMaintenance
          cancelAction={() => reset()}
          user={JSON.parse(dataMutation.searchBySerialIdResolver)}
          navigation={props.navigation}
        />
      ) : (
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
              <Text
                style={{color: '#ffffff', fontSize: 23, fontWeight: 'bold'}}>
                ESCANEAR DATOS
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
                  </>
                ) : (
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 23,
                      fontWeight: 'bold',
                    }}>
                    PARA HACER USO DE ESTE MODULO, NECESITAS ACTIVAR EL NFC DE
                    TU DISPOSITIVO
                  </Text>
                )}
              </Card.Content>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      )}
    </>
  );
};
export default AddSerialNumber;
