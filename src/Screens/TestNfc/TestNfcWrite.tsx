import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import useDataLayer from '../../hooks/useDataLayer';
import {useMutationValidation} from '../../services/Activation/useMutationValidation';
import {IStore} from '../../redux/store';

interface Props {
  navigation: any;
  route: any;
}

const TestNfcWrite: React.FC<Props> = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {serial} = route.params || {};
  const user = useSelector((store: IStore) => store.loggedUser);
  const keys = useSelector((store: any) => store.key);

  const [status, setStatus] = useState<string>('Obteniendo key del servidor...');
  const [response, setResponse] = useState<string>('');
  const [sentKey, setSentKey] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const hasStartedRef = useRef(false);

  const {mutate: getKey, isPending: isLoadingKey} = useMutationValidation();

  const terminateWriteCallback = useCallback((data: string) => {
    console.log('[TestNfcWrite] terminateWrite received:', data);

    if (data === '' || data === 'init') {
      return;
    }

    // Ignorar keys encriptadas (son las que enviamos, no respuestas)
    if (data.length > 50 || data.includes('+') || data.includes('/') || data.includes('=')) {
      console.log('[TestNfcWrite] Ignored outgoing key');
      return;
    }

    if (data === 'ACK') {
      console.log('[TestNfcWrite] ACK received - SUCCESS!');
      setStatus('ACK recibido - EXITO!');
      setResponse('ACK');
      setIsComplete(true);
      Alert.alert('Exito', 'Activacion completada correctamente');
      return;
    }

    if (data === 'NACK') {
      console.log('[TestNfcWrite] NACK received - ERROR');
      setStatus('NACK recibido - El dispositivo rechazo la key');
      setResponse('NACK');
      setIsComplete(true);
      return;
    }

    if (data.startsWith('E0')) {
      console.log('[TestNfcWrite] Error received:', data);
      setStatus(`Error del dispositivo: ${data}`);
      setResponse(data);
      setIsComplete(true);
      return;
    }

    console.log('[TestNfcWrite] Other response:', data);
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
    subscribed: isFocused,
  });

  // 1. Al montar, obtener key del backend
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    console.log('[TestNfcWrite] Getting key from backend...');
    setStatus('Obteniendo key del servidor...');

    getKey({
      idGas: user.idGas,
      serialNumber: serial,
      liters: 4,
      mileage: 5,
      idDispatcher: user._id,
    });
  }, []);

  // 2. Cuando llegue la key, iniciar sesión HCE y enviar
  useEffect(() => {
    if (keys.key && keys.key !== '' && !isComplete) {
      console.log('[TestNfcWrite] Key received:', keys.key);
      console.log('[TestNfcWrite] Key length:', keys.key.length);
      setSentKey(keys.key);
      setStatus('Key obtenida, enviando al dispositivo...');

      switchSession(true).then(() => {
        console.log('[TestNfcWrite] HCE session started, sending key...');
        updateProp('content', keys.key);
        updateProp('writable', true);
        setStatus('Esperando respuesta del dispositivo...');
      });
    }
  }, [keys.key, isComplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      console.log('[TestNfcWrite] Cleanup - stopping session');
      switchSession(false);
    };
  }, []);

  const handleBack = async () => {
    await switchSession(false);
    navigation.goBack();
  };

  const handleRetry = () => {
    hasStartedRef.current = false;
    setIsComplete(false);
    setResponse('');
    setStatus('Obteniendo key del servidor...');

    getKey({
      idGas: user.idGas,
      serialNumber: serial,
      liters: 4,
      mileage: 5,
      idDispatcher: user._id,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test NFC - Escritura</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Serial del dispositivo:</Text>
        <Text style={styles.infoText}>{serial || 'No disponible'}</Text>
      </View>

      <View style={styles.keyBox}>
        <Text style={styles.keyLabel}>Key enviada al NFC:</Text>
        <Text style={styles.keyText} numberOfLines={3}>
          {sentKey || 'Obteniendo...'}
        </Text>
        {sentKey && (
          <Text style={styles.keyLength}>Longitud: {sentKey.length} chars</Text>
        )}
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Estado:</Text>
        <Text style={styles.statusText}>{status}</Text>
        {isLoadingKey && <ActivityIndicator style={{marginTop: 10}} />}
      </View>

      <View style={styles.responseBox}>
        <Text style={styles.responseLabel}>Respuesta NFC:</Text>
        <Text style={[
          styles.responseText,
          response === 'ACK' && styles.responseSuccess,
          (response === 'NACK' || response.startsWith('E0')) && styles.responseError,
        ]}>
          {response || 'Esperando...'}
        </Text>
      </View>

      {isComplete && (
        <Button
          mode="contained"
          onPress={handleRetry}
          style={styles.button}
          buttonColor="#FF9800">
          Reintentar
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={handleBack}
        style={styles.button}>
        Volver a Lectura
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#e65100',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e65100',
    fontFamily: 'monospace',
  },
  keyBox: {
    backgroundColor: '#e8eaf6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  keyLabel: {
    fontSize: 14,
    color: '#3f51b5',
    marginBottom: 5,
  },
  keyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3f51b5',
    fontFamily: 'monospace',
  },
  keyLength: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statusBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  responseBox: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  responseLabel: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  responseSuccess: {
    color: '#4caf50',
  },
  responseError: {
    color: '#f44336',
  },
  button: {
    marginBottom: 15,
  },
});

export default TestNfcWrite;
