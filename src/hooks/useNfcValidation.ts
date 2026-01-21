import React from 'react';
import NfcManager from 'react-native-nfc-manager';
import {useDispatch} from 'react-redux';
import { nfcEnabledAction } from '../redux/states/nfcEnabledSlice';

export const useNfcValidation = () => {
  const [activeNfc, setActiveNfc] = React.useState<boolean>(true);

  const dispatch = useDispatch();
  const handlerNfcManager = async () => {
    const validationEnabled = await NfcManager.isEnabled();
    const validationSupport = await NfcManager.isSupported();
    if (validationSupport) {
      if (validationEnabled) {
        setActiveNfc(true);
      } else {
        setActiveNfc(false);
      }
    } else {
      setActiveNfc(false);
    }
  };

  const verifyEnabledRefresh = async () => {
    const validationEnabled = await NfcManager.isEnabled();
    if (validationEnabled){
         return true;
    }
    return false;
  };
  const handlerNfc = async () => {
    if (!activeNfc) {
      dispatch(nfcEnabledAction(false));
    } else {
      const isActive = await verifyEnabledRefresh();
      if (isActive) {
        dispatch(nfcEnabledAction(true));
      } else {
        dispatch(nfcEnabledAction(false));
      }
    }
  };

  React.useEffect(() => {
    handlerNfcManager();
  }, []);
  return {
    activeNfc,
    handlerNfc,
  };
};
