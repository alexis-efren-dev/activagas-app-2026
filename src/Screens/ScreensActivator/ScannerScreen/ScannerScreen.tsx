import React from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import {useDispatch, useSelector} from 'react-redux';

import {useMutationValidation} from '../../../services/Activation/useMutationValidation';
import { getAlertSuccess } from '../../../redux/states/alertsReducerState';
import { getKey } from '../../../redux/states/keySlice';
const {height} = Dimensions.get('screen');
interface IPropsRegisterActivation {
  route: any;
  navigation: any;
}
const ScannerActivation: React.FC<IPropsRegisterActivation> = ({
  route,
  navigation,
}) => {
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
  const {mutate, isError} = useMutationValidation();
  const keys = useSelector((store: any) => store.key);
  const {controllerTime, routeRefresh, stock, user, mileage, liters} =
    route.params;
  const [textRead, setTextRead] = React.useState<any>('');
  const [controllerRead, setControllerRead] = React.useState<boolean>(true);
  const [handleError, setHandleError] = React.useState<boolean>(false);
  const [reintentWrite, setReintentWrite] = React.useState<any>(0);
  const [reintentRead, setReintentRead] = React.useState<any>(0);
  const [serialNumber, setSerialNumber] = React.useState<any>('');
  const [controllerRefresh, setControllerRefresh] =
    React.useState<boolean>(false);
  const scrollY: any = React.useRef(new Animated.Value(0)).current;
  scrollY.addListener(({value}: any) => {
    const val = Math.ceil((height - value) / (height / controllerTime) / 1000);
    if (val === 0) {
    } else {
      setTextRead(val);
    }
  });
  const initAnimation = () => {
    readNdef();
    Animated.timing(scrollY, {
      toValue: height,
      useNativeDriver: true,
      duration: controllerTime,
    }).start(() => {
      setControllerRead(false);
      scrollY.setValue(0);
      NfcManager.cancelTechnologyRequest();
      setControllerRefresh(true);
      navigation.navigate(routeRefresh, {});
    });
  };
  const setNfc = async () => {
    await NfcManager.requestTechnology(NfcTech.Ndef);
  };
  React.useEffect(() => {
    setNfc();
  }, []);
  React.useEffect(() => {
    if (controllerRead) {
      initAnimation();
    }
  }, [controllerRead]);
  const readNdef = async () => {
    try {
      const sisi: any = await NfcManager.ndefHandler.getNdefMessage();
      let janic = '';
      for (let i = 0; i < sisi.ndefMessage[0].payload.length; i++) {
        if (i < 3) {
        } else {
          janic += String.fromCharCode(sisi.ndefMessage[0].payload[i]);
        }
      }
      setSerialNumber(janic);
    } catch (ex) {
      if (reintentRead <= 3) {
        setReintentRead(reintentRead + 1);
        readNdef();
      } else {
        dispatch(getKey({key: ''}));
        setHandleError(true);
      }
    }
  };
  const writeNdef = async (key: string) => {
    try {
      const parsedMessage = {
        A: key,
      };
      // await NfcManager.requestTechnology(NfcTech.Ndef);
      let bytes = Ndef.encodeMessage([
        Ndef.textRecord(JSON.stringify(parsedMessage)),
      ]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      dispatchErrors('Activacion exitosa');
      dispatch(getKey({key: ''}));
      NfcManager.cancelTechnologyRequest();
      setControllerRead(false);
      scrollY.setValue(0);
      navigation.navigate(routeRefresh, {});
    } catch (ex) {
      if (reintentWrite <= 3) {
        setReintentWrite(reintentWrite + 1);
        writeNdef(key);
      } else {
        dispatchErrors('Error de escritura, intentalo de nuevo');
        dispatch(getKey({key: ''}));
        NfcManager.cancelTechnologyRequest();
        setControllerRead(false);
        scrollY.setValue(0);
        navigation.navigate(routeRefresh, {});
      }
    }
  };
  React.useEffect(() => {
    if (serialNumber !== '') {
      if (stock) {
        navigation.navigate(routeRefresh, {
          serialNumber,
          item: user,
          stock,
        });
      } else {
        if (mileage !== 0) {
          mutate({
            idGas: user.idGas,
            mileage: Number(mileage),
            serialNumber,
            liters: Number(liters),
          });
        } else {
          mutate({
            idGas: user.idGas,
            serialNumber,
            liters: Number(liters),
          });
        }
      }
    }
  }, [serialNumber]);
  React.useEffect(() => {
    if (controllerRefresh && serialNumber === '') {
      if (stock) {
        navigation.navigate(routeRefresh, {item: user, stock});
      } else {
        navigation.navigate(routeRefresh, {});
      }
    }
  }, [controllerRefresh]);
  React.useEffect(() => {
    if (handleError) {
      dispatchErrors('Error de lectura, intenta de nuevo');
      if (stock) {
        navigation.navigate(routeRefresh, {item: user, stock});
      } else {
        navigation.navigate(routeRefresh, {});
      }
    }
  }, [handleError]);
  React.useEffect(() => {
    if (keys.key) {
      writeNdef(keys.key);
    }
  }, [keys]);
  React.useEffect(() => {
    if (isError) {
      navigation.navigate(routeRefresh);
    }
  }, [isError]);
  return (
    <>
      {/*controllerRead ? (
        <View
          style={[
            styles.indicatorText,
            {
              width: width / 4,
              height: height / 8,
              top: height / 2,
              right: width / 4,
              borderRadius: height / 2,
            },
          ]}>
          <Text style={styles.textTimer}>{textRead}</Text>
        </View>
      ) : null*/}
      {controllerRead ? (
        <View style={{backgroundColor: 'white', flex: 1}}>
          <Animated.Image
            source={{
              uri: 'https://activagasbeta-files.s3.amazonaws.com/Negro.png',
            }}
            style={{
              zIndex: 9999999999,
              height: 70,
              top: height / 2,
              transform: [
                {
                  rotate: scrollY.interpolate({
                    inputRange: [0, height],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }} />
          <Animated.View
            ref={scrollY}
            style={[
              StyleSheet.absoluteFillObject,
              {backgroundColor: '#191514', transform: [{translateY: scrollY}]},
            ]} />
        </View>
      ) : null}
    </>
  );
};
export default ScannerActivation;
