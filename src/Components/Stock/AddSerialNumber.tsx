/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dataFormCreateSerial from '../../DataForms/dataFormCreateSerial.json';
import {useMutationCreateSerialNumber} from '../../services/Stock/useMutationCreateSerialNumber';
import {DynamicForm} from '../DynamicForms/DynamicForm';

const {width} = Dimensions.get('screen');

interface IAdd {
  user: any;
  serialNumber: any;
  navigation: any;
}

const AddSerialNumber: React.FC<IAdd> = ({
  user,
  navigation,
  serialNumber,
}): JSX.Element => {
  const {mutate, isPending: isLoading} = useMutationCreateSerialNumber();
  const formRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const buttonInfo = {
    style: {display: 'none'},
    contentStyle: {display: 'none'},
  };

  const handleSubmit = (dataFields: any) => {
    mutate({
      idGas: user._id,
      idDevice: serialNumber,
      serialNumber: dataFields.serialNumber,
    });
    dataFields.serialNumber = '';
  };

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="clipboard-text-outline" size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>Ingresar Datos</Text>
          <Text style={styles.headerSubtitle}>
            Completa la información del número de serie
          </Text>
        </View>

        {/* Selected Gasera Badge */}
        <View style={styles.gaseraBadge}>
          <Icon name="gas-station" size={18} color="#1C9ADD" />
          <Text style={styles.gaseraBadgeText}>{user.name}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <DynamicForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            json={dataFormCreateSerial}
            labelSubmit=""
            buttonProps={buttonInfo}
            showButton={false}
            formRef={formRef}
          />

          {/* Create Button */}
          <Animated.View
            style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={() => formRef.current?.handleSubmit()}
              disabled={isLoading}
              activeOpacity={0.8}>
              <LinearGradient
                style={styles.buttonGradient}
                colors={isLoading ? ['#666', '#888'] : ['#4CAF50', '#388E3C']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Icon name="check" size={22} color="#FFFFFF" />
                )}
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creando...' : 'Crear'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Dashboard')}
            activeOpacity={0.8}>
            <Icon name="close" size={20} color="#E53935" />
            <Text style={styles.secondaryButtonText}>Terminar</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'transparent',
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
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  gaseraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 24,
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
  gaseraBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButton: {
    width: width * 0.7,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4CAF50',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: width * 0.7,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 16,
    gap: 10,
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
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53935',
  },
});

export default AddSerialNumber;
