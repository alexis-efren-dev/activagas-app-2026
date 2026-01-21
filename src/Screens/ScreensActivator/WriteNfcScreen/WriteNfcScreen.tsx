import React from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from '../../Activation/Styles';
import { getAlertSuccess } from '../../../redux/states/alertsReducerState';
import { getKey } from '../../../redux/states/keySlice';
const {height, width} = Dimensions.get('screen');
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
  const keys = useSelector((store: any) => store.key);
  const {controllerTime, routeRefresh} = route.params;
  const [textRead, setTextRead] = React.useState<any>('');
  const [controllerRead, setControllerRead] = React.useState<boolean>(true);
  const [handleError, setHandleError] = React.useState<boolean>(false);
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
    readNdef(keys.key);
    Animated.timing(scrollY, {
      toValue: height,
      useNativeDriver: true,
      duration: controllerTime,
    }).start(() => {
      setControllerRead(false);
      scrollY.setValue(0);
      NfcManager.cancelTechnologyRequest();
      setControllerRefresh(true);
    });
  };
  React.useEffect(() => {
    if (controllerRead) {
      initAnimation();
    }
  }, [controllerRead]);

  const readNdef = async (key: string) => {
    try {
      const parsedMessage = {
        A: key,
      };

      await NfcManager.requestTechnology(NfcTech.Ndef);
      let bytes = Ndef.encodeMessage([
        Ndef.textRecord(JSON.stringify(parsedMessage)),
      ]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      dispatchErrors('Activacion exitosa');
      dispatch(getKey({key: ''}));
      NfcManager.cancelTechnologyRequest();
    } catch (ex) {
      NfcManager.cancelTechnologyRequest();
      setHandleError(true);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setControllerRead(false);
      scrollY.setValue(0);
    }
  };

  React.useEffect(() => {
    if (serialNumber !== '') {
      navigation.navigate(routeRefresh, {serialNumber});
    }
  }, [serialNumber]);
  React.useEffect(() => {
    if (controllerRefresh && serialNumber === '') {
      navigation.navigate(routeRefresh, {});
    }
  }, [controllerRefresh]);
  React.useEffect(() => {
    if (handleError) {
      dispatchErrors('Error de lectura, intenta de nuevo');
      navigation.navigate(routeRefresh, {});
    }
  }, [handleError]);
  return (
    <>
      {controllerRead ? (
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
      ) : null}
      {controllerRead ? (
        <View style={{backgroundColor: 'white', flex: 1}}>
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
