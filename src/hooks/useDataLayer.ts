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

/** Default NFC tag properties */
const defaultProps: NFCTagReactStateProps = {
  content: '',
  type: NFCTagType4.stringFromContentType(NFCTagType4NDEFContentType.Text),
  writable: false,
  _pristine: true,
};

/** Debounce delay for tag updates (ms) */
const TAG_UPDATE_DELAY = 600;

/**
 * Creates a log entry with timestamp
 */
const createLogEntry = (eventName: string): LogEntry => ({
  time: new Date().toISOString(),
  message: eventName,
});

/**
 * Props for useDataLayer hook
 */
interface UseDataLayerProps {
  /** Callback when NFC read event occurs */
  terminate?: () => void;
  /** Callback when NFC write completes with content */
  terminateWrite?: (content: string) => void;
}

/**
 * Hook for managing NFC/HCE data layer
 *
 * Handles:
 * - HCE session state (enabled/disabled)
 * - NFC tag properties synchronization
 * - Bidirectional sync between app state and HCE library
 * - Event logging
 *
 * @param props - Configuration callbacks
 * @returns DataLayer object with state and controls
 */
const useDataLayer = ({
  terminate = () => {},
  terminateWrite,
}: UseDataLayerProps): DataLayer => {
  const {session} = useContext(HCESessionContext);
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================
  // Session Enabled State Management
  // ============================================
  const [enabled, setEnabled] = useState<boolean>(false);

  /**
   * Toggle HCE session on/off
   */
  const switchSession = useCallback(
    async (enable: boolean) => {
      try {
        setLoading(true);
        await session.setEnabled(enable);
        setEnabled(enable);
      } catch (e) {
        console.error('HCE session switch error:', e);
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  // ============================================
  // NFC Tag Properties State
  // ============================================
  const [nfcTagProps, setNfcTagProps] =
    useState<NFCTagReactStateProps>(defaultProps);

  /**
   * Update a single NFC tag property
   */
  const updateProp = useCallback(
    (prop: keyof Omit<NFCTagReactStateProps, '_pristine'>, value: string | boolean) => {
      setNfcTagProps((state) => ({
        ...state,
        [prop]: value,
        _pristine: false,
      }));
    },
    [],
  );

  // ============================================
  // Sync: APPLICATION → LIBRARY
  // Debounced update of HCE library when app state changes
  // ============================================
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Push tag properties to HCE library
   */
  const updateTag = useCallback(
    async (localNfcTagProps: NFCTagReactStateProps) => {
      setLoading(true);
      const tag = new NFCTagType4({
        type: NFCTagType4.contentTypeFromString(localNfcTagProps.type),
        content: localNfcTagProps.content,
        writable: localNfcTagProps.writable,
      });
      try {
        await session.setApplication(tag);
      } catch {
        // Retry once on failure
        await session.setApplication(tag);
      }
      setLoading(false);
    },
    [session],
  );

  // Debounced sync to library when props change
  useEffect(() => {
    if (!nfcTagProps._pristine) {
      timeoutRef.current = setTimeout(() => {
        updateTag(nfcTagProps);
      }, TAG_UPDATE_DELAY);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nfcTagProps, updateTag]);

  // ============================================
  // Sync: LIBRARY → APPLICATION
  // Update app state when HCE library state changes
  // ============================================
  /**
   * Pull state from HCE library to app
   */
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

    // Notify on write completion (content !== 'init')
    // TODO: Content check may change with AES128 implementation
    if (terminateWrite && application.content.content !== 'init') {
      terminateWrite(application.content.content);
    }

    setEnabled(session.enabled);
  }, [session, terminateWrite]);

  // Subscribe to HCE write events
  useEffect(() => {
    const cancelSubscription = session.on(
      HCESession.Events.HCE_STATE_WRITE_FULL,
      updateApp,
    );
    updateApp(); // Initial sync
    return () => cancelSubscription();
  }, [session, updateApp]);

  // ============================================
  // HCE Read Event Handler
  // ============================================
  const handleRead = useCallback(() => {
    terminate();
  }, [terminate]);

  // Subscribe to HCE read events
  useEffect(() => {
    const cancelSubscription = session.on(
      HCESession.Events.HCE_STATE_READ,
      handleRead,
    );
    return () => cancelSubscription();
  }, [session, handleRead]);

  // ============================================
  // Event Logging
  // ============================================
  const [log, setLog] = useState<Array<LogEntry>>([]);

  const logger = useCallback((eventData: any) => {
    setLog((prev) => [...prev, createLogEntry(String(eventData))]);
  }, []);

  // Subscribe to all HCE events for logging
  useEffect(() => {
    const cancelSubscription = session.on(null, logger);
    return () => cancelSubscription();
  }, [session, logger]);

  // ============================================
  // Return Hook API
  // ============================================
  return {
    nfcTagProps,
    updateProp,
    switchSession,
    log,
    enabled,
    loading,
  };
};

export default useDataLayer;
