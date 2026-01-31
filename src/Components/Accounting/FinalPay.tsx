import {StackNavigationProp} from '@react-navigation/stack';
import React, {useRef, useEffect, useState} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import dataFormRegisterPay from '../../DataForms/dataFormRegisterPay.json';
import {IStore} from '../../redux/store';
import {useMutationRegisterPay} from '../../services/Clients/useMutationRegisterPay';
import {DynamicForm} from '../DynamicForms/DynamicForm';

const {width} = Dimensions.get('screen');

interface IUser {
  user: any;
  navigation: StackNavigationProp<any, any>;
}

const FinalPay: React.FC<IUser> = ({user, navigation}) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const [parsedForm, setParsedForm] = useState<any>(false);
  const {mutate, isPending: isLoading} = useMutationRegisterPay();
  const formRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const buttonInfo = {
    style: {display: 'none'},
    contentStyle: {display: 'none'},
  };

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

  const handleSubmit = (dataFields: any) => {
    mutate({
      idGas: userRedux.idGas,
      idAccounting: userRedux._id,
      idClient: user.infoData._id,
      pay: dataFields.pay,
      dateToPay: user.paymentData.nextDatePayment,
    });
    dataFields.pay = '';
  };


  useEffect(() => {
    if (user?.paymentData) {
      if (user.paymentData.isPaymentInitiated) {
        dataFormRegisterPay[0].value = String(
          Number(user.paymentData.automaticPayment) -
            Number(user.paymentData.amountPaid),
        );
      } else {
        dataFormRegisterPay[0].value = user.paymentData.automaticPayment;
      }

      setParsedForm(dataFormRegisterPay);
    }
  }, [user]);

  const remainingAmount =
    Number(user.paymentData.automaticPayment) -
    Number(user.paymentData.amountPaid);

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="credit-card-check" size={36} color="#4CAF50" />
          </View>
          <Text style={styles.headerTitle}>Registrar Pago</Text>
          <Text style={styles.headerSubtitle}>
            Ingresa el monto a registrar
          </Text>
        </View>

        {/* Vehicle Badge */}
        <View style={styles.vehicleBadge}>
          <Icon name="car" size={16} color="#1C9ADD" />
          <Text style={styles.vehicleBadgeText}>
            {user.infoData.plates} - {user.infoData.model}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Card */}
          <View
            style={[
              styles.infoCard,
              user.paymentData.isObligatory && styles.infoCardUrgent,
            ]}>
            <View style={styles.infoCardHeader}>
              <View
                style={
                  user.paymentData.isObligatory
                    ? styles.statusBadgeUrgent
                    : styles.statusBadgeNormal
                }>
                <Icon
                  name={
                    user.paymentData.isObligatory
                      ? 'alert-circle'
                      : 'information'
                  }
                  size={16}
                  color={user.paymentData.isObligatory ? '#E53935' : '#1C9ADD'}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color: user.paymentData.isObligatory
                        ? '#E53935'
                        : '#1C9ADD',
                    },
                  ]}>
                  {user.paymentData.isObligatory
                    ? 'Pago Vencido'
                    : 'Información de Pago'}
                </Text>
              </View>
            </View>

            <Text style={styles.infoCardText}>
              {user.paymentData.isObligatory
                ? `La fecha de pago fue el día `
                : `La fecha de pago es hasta el día `}
              <Text
                style={
                  user.paymentData.isObligatory
                    ? styles.highlightUrgent
                    : styles.highlight
                }>
                {user.paymentData.parsedData}
              </Text>
              {`. Al ingresar este pago, la siguiente fecha de pago sería exactamente en un mes contando a partir de la fecha ya mencionada.`}
            </Text>
          </View>

          {/* Partial Payment Warning */}
          {user.paymentData.isPaymentInitiated ? (
            <View style={styles.warningCard}>
              <View style={styles.warningHeader}>
                <Icon name="alert" size={20} color="#FF9800" />
                <Text style={styles.warningTitle}>Pago Parcial Detectado</Text>
              </View>
              <Text style={styles.warningText}>
                De esta fecha de pago se han pagado{' '}
                <Text style={styles.highlightWarning}>
                  ${user.paymentData.amountPaid}
                </Text>{' '}
                de los{' '}
                <Text style={styles.highlightWarning}>
                  ${user.paymentData.automaticPayment}
                </Text>{' '}
                cobrados en cada pago.
              </Text>
              <View style={styles.remainingContainer}>
                <Text style={styles.remainingLabel}>Restante por pagar:</Text>
                <Text style={styles.remainingAmount}>${remainingAmount}</Text>
              </View>
              <Text style={styles.warningSubtext}>
                Se le otorgaron{' '}
                <Text style={styles.highlightWarning}>
                  {user.paymentData.approvedDays} días
                </Text>{' '}
                de activación temporales.
              </Text>
            </View>
          ) : null}

          {/* Form */}
          {parsedForm ? (
            <DynamicForm
              isInitialDisabled={false}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              json={parsedForm}
              labelSubmit=""
              buttonProps={buttonInfo}
              showButton={false}
              formRef={formRef}
            />
          ) : null}

          {/* Register Payment Button */}
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
                  {isLoading ? 'Registrando...' : 'Registrar Pago'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Finish Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              navigation.navigate('Dashboard', {
                refresh: true,
              });
            }}
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
  vehicleBadge: {
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
  vehicleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoCardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  infoCardHeader: {
    marginBottom: 12,
  },
  statusBadgeNormal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusBadgeUrgent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoCardText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
    color: '#1C9ADD',
  },
  highlightUrgent: {
    fontWeight: '700',
    color: '#E53935',
  },
  warningCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
  },
  warningText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 22,
    marginBottom: 12,
  },
  highlightWarning: {
    fontWeight: '700',
    color: '#E65100',
  },
  remainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  remainingLabel: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '500',
  },
  remainingAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E65100',
  },
  warningSubtext: {
    fontSize: 13,
    color: '#795548',
    lineHeight: 20,
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

export default FinalPay;
