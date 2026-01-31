/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HandlerVerification from '../../../Components/Verifications/HandlerVerification';
import {useQueryGetVerificationData} from '../../../services/Verification/useQueryGetVerificationData';

const {width} = Dimensions.get('screen');

const VerifyUnit = (props: any) => {
  const [dataVariables, setDataVariables] = React.useState<any>(null);
  const [handlerData, setHandlerData] = React.useState<any>(null);
  const {data, isError, isLoading, refetch} = useQueryGetVerificationData({
    _id: dataVariables,
  });

  React.useEffect(() => {
    if (props?.route?.params?.item) {
      setDataVariables(props.route.params.item._id);
    } else if (props?.route?.params) {
      setDataVariables(false);
    }
  }, [props]);

  React.useEffect(() => {
    if (dataVariables) {
      refetch();
    }
  }, [dataVariables]);

  React.useEffect(() => {
    if (data) {
      setHandlerData(data.getDateVerificationResolver);
    }
  }, [data]);

  if (dataVariables === null || isLoading) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (isError || dataVariables === false) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Icon name="alert-circle-outline" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error de Conexión</Text>
            <Text style={styles.errorText}>
              No se pudo cargar la información.{'\n'}Inténtalo más tarde.
            </Text>
            <TouchableOpacity
              style={styles.backButtonError}
              onPress={() => props.navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#00BCD4" />
              <Text style={styles.backButtonErrorText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (handlerData) {
    if (handlerData.date === 'false') {
      return (
        <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
          <View style={styles.noVerificationContainer}>
            <View style={styles.noVerificationCard}>
              <View style={styles.noVerificationIconContainer}>
                <Icon name="car-off" size={48} color="#FF9800" />
              </View>
              <Text style={styles.noVerificationTitle}>Sin Verificación</Text>
              <Text style={styles.noVerificationText}>
                Este vehículo no tiene verificación{'\n'}programada actualmente.
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => props.navigation.goBack()}
                activeOpacity={0.8}>
                <Icon name="arrow-left" size={20} color="#FFFFFF" />
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      );
    } else {
      return (
        <HandlerVerification
          navigation={props.navigation}
          data={handlerData}
          request={props.route.params.item}
        />
      );
    }
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
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
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width - 48,
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
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  backButtonError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonErrorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00BCD4',
  },
  noVerificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  noVerificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width - 48,
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
  noVerificationIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noVerificationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  noVerificationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#00BCD4',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default VerifyUnit;
