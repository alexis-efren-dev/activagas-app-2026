/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  HCESessionContext,
  HCESession,
  NFCTagType4NDEFContentType,
  NFCTagType4,
} from 'react-native-hce';
import type {
  DataLayer,
  NFCTagReactStateProps,
  LogEntry,
} from './DataLayerTypes';

const defaultProps: NFCTagReactStateProps = {
  content: '',
  type: NFCTagType4.stringFromContentType(NFCTagType4NDEFContentType.Text),
  writable: false,
  _pristine: true,
};

const createLogEntry = (eventName: string): LogEntry => ({
  time: new Date().toISOString(),
  message: eventName,
});

/**
 * The hook encapsulating the data management layer.
 */
interface Props {
  terminate?: any;
  terminateWrite?: any;
}
const useDataLayer = ({
  terminate = () => {},
  terminateWrite,
}: Props): DataLayer => {
  const {session} = useContext(HCESessionContext);
  const [loading, setLoading] = useState<boolean>(false);

  // ** Following section of code is responsible for: **
  // Management of "Enabled" field state in the application
  const [enabled, setEnabled] = useState<boolean>(false);

  const switchSession = useCallback(
    async (enable: any) => {
      try {
        setLoading(true);
        await session.setEnabled(enable);
        setEnabled(enable);
        setLoading(false);
        //fix data in memory
        //  setNfcTagProps(defaultProps);
      } catch (e) {
        console.log('e', e);
      }
    },
    [setLoading, session, setEnabled],
  );

  // ** Following section of code is responsible for: **
  // Management of "HCE Application" - related fields state in the application
  const [nfcTagProps, setNfcTagProps] =
    useState<NFCTagReactStateProps>(defaultProps);

  const updateProp = useCallback(
    (prop: string, value: any) => {
      setNfcTagProps((state: any) => ({
        ...state,
        [prop]: value,
        _pristine: false,
      }));
    },
    [setNfcTagProps],
  );

  // ** Following section of code is responsible for: **
  // Synchronization of state: APPLICATION ---> LIBRARY.
  const timeout: any = useRef<ReturnType<typeof setTimeout>>(null);

  const updateTag = useCallback(
    async (localNfcTagProps: any) => {
      setLoading(true);
      const tag = new NFCTagType4({
        type: NFCTagType4.contentTypeFromString(localNfcTagProps.type),
        content: localNfcTagProps.content,
        writable: localNfcTagProps.writable,
      });
      try {
        await session.setApplication(tag);
      } catch (e: any) {
        await session.setApplication(tag);
      }

      setLoading(false);
    },
    [setLoading, session],
  );

  useEffect(() => {
    if (!nfcTagProps._pristine) {
      const boundUpdateTag = updateTag.bind(null, nfcTagProps);
      timeout.current = setTimeout(boundUpdateTag, 600);
    }

    return () => clearTimeout(timeout.current);
  }, [nfcTagProps, updateTag]);

  // ** Following section of code is responsible for: **
  // Synchronization of state: LIBRARY ---> APPLICATION.
  const updateApp = useCallback(() => {
    const application = session.application;
    if (application === null) {
      return;
    }
    setNfcTagProps({
      type: application.content.type,
      content: application.content.content,
      writable: application.content.writable,
      _pristine: true,
    });

    if (terminateWrite) {
      //TODO el k puede cambiar con la implementacion de los aes128
      if (application.content.content !== 'init') {
        terminateWrite(application.content.content);
      }
    }

    setEnabled(session.enabled);
  }, [session, setNfcTagProps, setEnabled]);

  useEffect(() => {
    const cancelSubscription = session.on(
      HCESession.Events.HCE_STATE_WRITE_FULL,
      updateApp,
    );
    updateApp();

    return () => cancelSubscription();
  }, [session, setNfcTagProps, setEnabled, updateApp]);

  const logRead = () => {
    //const applicationData = session.application;
    terminate();
  };
  useEffect(() => {
    const cancelSubscription = session.on(
      HCESession.Events.HCE_STATE_READ, //aqui poner evento de escritura y arriba detectar si el content.content es igual a success, si es asi, terminar a la v
      logRead,
    );

    return () => cancelSubscription();
  }, [session, setNfcTagProps, setEnabled, updateApp]);

  // ** Following section of code is responsible for: **
  // Logging the events to preview in "Events" pane.
  const [log, setLog] = useState<Array<LogEntry>>([]);

  const logger = useCallback(
    (eventData: any) => {
      setLog(msg => [...msg, createLogEntry(eventData)]);
    },
    [setLog],
  );

  useEffect(() => {
    const cancelSubscription = session.on(null, logger);
    return () => cancelSubscription();
  }, [session, logger]);
  /*
  useEffect(() => {
    console.log(
      'Refresh App',
      nfcTagProps,
      session.application,
      session.enabled,
    );
  }, [enabled, JSON.stringify(session), nfcTagProps]);
  */

  // ** Following section of code is responsible for: **
  // Returning the hook result.
  return {nfcTagProps, updateProp, switchSession, log, enabled, loading};
};

export default useDataLayer;
