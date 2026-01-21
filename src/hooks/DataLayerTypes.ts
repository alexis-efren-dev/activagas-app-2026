export interface LogEntry {
    time: string;
    message: string;
  }

  export interface NFCTagReactStateProps {
    content: string;
    type: string;
    writable: boolean;
    _pristine: boolean;
  }

  export interface DataLayer {
    [x: string]: any;
    nfcTagProps: NFCTagReactStateProps;
    updateProp: any;
    switchSession: (enable: boolean) => Promise<void>;
    enabled: boolean;
    log: LogEntry[];
    loading: boolean;
  }
