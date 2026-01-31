/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {DynamicForm} from '../../../Components/DynamicForms/DynamicForm';
import UserInfoMaintenance from '../../../Components/Maintenance/UserInfo';
import dataFormCreateSerial from '../../../DataForms/dataFormCreateId.json';
import useDataLayer from '../../../hooks/useDataLayer';
import {IStore} from '../../../redux/store';
import {useQuerySearchBySerialId} from '../../../services/Accounting/useQuerySearchBySerialId';

const {width} = Dimensions.get('screen');

const MAINTENANCE_COLOR = '#FF9800';

const HomePlatesMaintenance = (props: any): JSX.Element => {
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
  const isInitializedRef = useRef(false);
  const switchSessionRef = useRef<((enable: boolean) => Promise<void>) | null>(null);

  const terminateWriteCallback = useCallback((data: string) => {
    if (data && switchSessionRef.current) {
      setNfcSerial(['serialNumber', data]);
      switchSessionRef.current(false);
    }
  }, []);

  const {switchSession, updateProp} = useDataLayer({
    terminateWrite: terminateWriteCallback,
  });

  switchSessionRef.current = switchSession;

  const {enabled} = useSelector((store: IStore) => store.nfcEnabled);

  const buttonInfo = {
    style: styles.submitButton,
    contentStyle: styles.submitButtonContent,
    buttonColor: MAINTENANCE_COLOR,
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
  }, [content, switchSession, updateProp]);

  React.useEffect(() => {
    if (!dataMutation && !isInitializedRef.current) {
      isInitializedRef.current = true;
      switchSession(true);
      updateProp('writable', true);
      updateProp('content', 'init');
      setCustomJson([...dataFormCreateSerial]);
      setNfcSerial(['serialNumber', '']);
    }
    if (dataMutation) {
      isInitializedRef.current = false;
    }
  }, [dataMutation, switchSession, updateProp]);

  if (dataMutation) {
    return (
      <UserInfoMaintenance
        cancelAction={() => reset()}
        user={JSON.parse(dataMutation.searchBySerialIdResolver)}
        navigation={props.navigation}
      />
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="wrench" size={36} color={MAINTENANCE_COLOR} />
          </View>
          <Text style={styles.headerTitle}>Mantenimiento</Text>
          <Text style={styles.headerSubtitle}>
            Escanea el dispositivo para continuar
          </Text>
        </View>

        {/* NFC Status Badge */}
        <View style={styles.badgeContainer}>
          <View style={[styles.nfcBadge, !enabled && styles.nfcBadgeDisabled]}>
            <Icon
              name={enabled ? 'nfc' : 'nfc-off'}
              size={16}
              color={enabled ? '#4CAF50' : '#E53935'}
            />
            <Text
              style={[
                styles.nfcBadgeText,
                !enabled && styles.nfcBadgeTextDisabled,
              ]}>
              NFC {enabled ? 'Activado' : 'Desactivado'}
            </Text>
          </View>
        </View>

        {/* Instructions Card - ARRIBA */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Icon name="information" size={20} color={MAINTENANCE_COLOR} />
            <Text style={styles.infoCardTitle}>Instrucciones</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepNumber}>
              <Text style={styles.infoStepNumberText}>1</Text>
            </View>
            <Text style={styles.infoStepText}>
              Escanea el serial del dispositivo con NFC
            </Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepNumber}>
              <Text style={styles.infoStepNumberText}>2</Text>
            </View>
            <Text style={styles.infoStepText}>
              Verifica la informacion del vehiculo
            </Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepNumber}>
              <Text style={styles.infoStepNumberText}>3</Text>
            </View>
            <Text style={styles.infoStepText}>
              Registra el mantenimiento realizado
            </Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {enabled ? (
            <>
              <View style={styles.scanIconContainer}>
                <View style={styles.scanIconWrapper}>
                  <Icon name="cellphone-nfc" size={40} color={MAINTENANCE_COLOR} />
                </View>
                <Text style={styles.scanTitle}>Escanear Datos</Text>
                <Text style={styles.scanSubtitle}>
                  Acerca el dispositivo al equipo NFC o ingresa el serial
                  manualmente
                </Text>
              </View>

              <View style={styles.formContainer}>
                <DynamicForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  json={customJson}
                  labelSubmit="Buscar"
                  buttonProps={buttonInfo}
                  setExtractData={nfcSerial}
                />
              </View>
            </>
          ) : (
            <View style={styles.nfcDisabledContainer}>
              <View style={styles.nfcDisabledIconContainer}>
                <Icon name="nfc-off" size={40} color="#E53935" />
              </View>
              <Text style={styles.nfcDisabledTitle}>NFC Desactivado</Text>
              <Text style={styles.nfcDisabledText}>
                Para usar este modulo, necesitas activar el NFC de tu
                dispositivo en la configuracion del sistema.
              </Text>
            </View>
          )}
        </View>

        {/* Spacer for bottom tab */}
        <View style={styles.bottomSpacer} />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  nfcBadgeDisabled: {
    backgroundColor: '#FFEBEE',
  },
  nfcBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  nfcBadgeTextDisabled: {
    color: '#C62828',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: width * 0.9,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: MAINTENANCE_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  infoStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoStepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: MAINTENANCE_COLOR,
  },
  infoStepText: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scanIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scanIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  scanSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  formContainer: {
    width: '100%',
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 6,
  },
  nfcDisabledContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  nfcDisabledIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nfcDisabledTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 6,
  },
  nfcDisabledText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default HomePlatesMaintenance;
