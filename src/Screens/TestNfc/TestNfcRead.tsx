import React, {useState, useCallback, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import useDataLayer from '../../hooks/useDataLayer';

interface Props {
  navigation: any;
}

const TestNfcRead: React.FC<Props> = ({navigation}) => {
  const isFocused = useIsFocused();
  const [serial, setSerial] = useState<string>('');
  const [status, setStatus] = useState<string>('Esperando lectura NFC...');
  const serialRef = useRef<string>('');

  const terminateWriteCallback = useCallback((data: string) => {
    console.log('[TestNfcRead] terminateWrite received:', data);

    // Ignorar respuestas de control
    const ignoredResponses = ['', 'ACK', 'NACK', 'E00', 'E01', 'E02', 'E03', 'init'];
    if (ignoredResponses.includes(data)) {
      console.log('[TestNfcRead] Ignored response:', data);
      return;
    }

    // Ignorar keys encriptadas (base64)
    if (data.length > 50 || data.includes('+') || data.includes('/') || data.includes('=')) {
      console.log('[TestNfcRead] Ignored encrypted key');
      return;
    }

    // Es un serial válido
    console.log('[TestNfcRead] Valid serial received:', data);
    serialRef.current = data;
    setSerial(data);
    setStatus('Serial obtenido!');
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
    subscribed: isFocused,
  });

  // Iniciar sesión HCE al montar
  useEffect(() => {
    console.log('[TestNfcRead] Starting HCE session...');
    switchSession(true).then(() => {
      console.log('[TestNfcRead] HCE session started');
      updateProp('content', 'init');
      updateProp('writable', true);
    });

    return () => {
      console.log('[TestNfcRead] Cleanup - stopping session');
      switchSession(false);
    };
  }, []);

  const handleGoToWrite = async () => {
    if (!serial) {
      Alert.alert('Error', 'Primero escanea un dispositivo NFC');
      return;
    }

    // Cerrar sesión antes de navegar
    console.log('[TestNfcRead] Closing session before navigation...');
    await switchSession(false);
    updateProp('content', '');
    updateProp('writable', false);

    // Navegar a la pantalla de escritura
    navigation.navigate('TestNfcWrite', {serial});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test NFC - Lectura</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Estado:</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.serialBox}>
        <Text style={styles.serialLabel}>Serial:</Text>
        <Text style={styles.serialText}>{serial || '---'}</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleGoToWrite}
        disabled={!serial}
        style={styles.button}
        buttonColor="#4CAF50">
        VAMOS - Ir a Escritura
      </Button>

      <Button
        mode="outlined"
        onPress={() => {
          setSerial('');
          setStatus('Esperando lectura NFC...');
          switchSession(true).then(() => {
            updateProp('content', 'init');
            updateProp('writable', true);
          });
        }}
        style={styles.button}>
        Reiniciar Lectura
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
  statusBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
  serialBox: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  serialLabel: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
  serialText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    fontFamily: 'monospace',
  },
  button: {
    marginBottom: 15,
  },
});

export default TestNfcRead;
