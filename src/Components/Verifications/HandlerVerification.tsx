import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useMutationUpdateNextVerification} from '../../services/Verification/useMutationUpdateNextVerification';

const {width} = Dimensions.get('screen');

interface IProps {
  data: any;
  request: any;
  navigation: any;
}

const HandlerVerification: React.FC<IProps> = ({data, request, navigation}) => {
  const {mutate, isPending: isLoading} = useMutationUpdateNextVerification();

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="shield-check" size={40} color="#00BCD4" />
          </View>
          <Text style={styles.headerTitle}>VERIFICAR</Text>
          <Text style={styles.headerSubtitle}>
            Confirma la verificación del equipo
          </Text>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            data.expired ? styles.statusExpired : styles.statusPending,
          ]}>
          <Icon
            name={data.expired ? 'alert-circle' : 'calendar-clock'}
            size={18}
            color={data.expired ? '#E53935' : '#FF9800'}
          />
          <Text
            style={[
              styles.statusText,
              data.expired ? styles.statusTextExpired : styles.statusTextPending,
            ]}>
            {data.expired ? 'Verificación Vencida' : 'Verificación Pendiente'}
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Icon
              name={data.expired ? 'calendar-alert' : 'calendar-check'}
              size={32}
              color={data.expired ? '#E53935' : '#00BCD4'}
            />
          </View>

          <Text style={styles.infoTitle}>
            {data.expired ? 'Verificación Urgente' : 'Fecha de Verificación'}
          </Text>

          <View style={styles.dateContainer}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.dateText}>{data.date}</Text>
          </View>

          <Text style={styles.infoDescription}>
            {data.expired
              ? 'Este equipo debió haber sido verificado antes de la fecha indicada. Realiza la verificación lo antes posible.'
              : 'Este equipo deberá ser verificado antes de la fecha indicada. Puedes realizar la verificación en estos momentos.'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.instructionText}>
            Selecciona el período de verificación:
          </Text>

          {/* Verification Button */}
          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
            onPress={() =>
              mutate({
                _id: request._id,
                idGas: request.idGas,
                condition: '1',
              })
            }
            disabled={isLoading}
            activeOpacity={0.8}>
            <LinearGradient
              style={styles.verifyButtonGradient}
              colors={isLoading ? ['#888', '#666'] : ['#00BCD4', '#0097A7']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Icon name="check-circle" size={22} color="#FFFFFF" />
              )}
              <Text style={styles.verifyButtonText}>
                {isLoading ? 'Procesando...' : 'Verificar por 1 año'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Finish Button */}
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => navigation.navigate('Dashboard')}
          activeOpacity={0.8}>
          <Icon name="check" size={20} color="#4CAF50" />
          <Text style={styles.finishButtonText}>Terminar</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color="rgba(255, 255, 255, 0.9)" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    marginBottom: 8,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
  },
  statusExpired: {
    backgroundColor: '#FFEBEE',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusTextExpired: {
    color: '#E53935',
  },
  statusTextPending: {
    color: '#FF9800',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    alignItems: 'center',
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
  infoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  verifyButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00BCD4',
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
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  verifyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
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
  finishButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4CAF50',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: width - 48,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default HandlerVerification;
