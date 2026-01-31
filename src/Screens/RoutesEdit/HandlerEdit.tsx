import React, {useRef, useEffect} from 'react';
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

const {width} = Dimensions.get('screen');

const HandlerEdit = (props: any) => {
  const [user, setUser] = React.useState<any>(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.item) {
            setUser(props.route.params.item);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);

  if (user === false) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando usuario...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (user === '') {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Icon name="server-off" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error de Conexión</Text>
            <Text style={styles.errorText}>
              No se pudo cargar la información.{'\n'}Intenta de nuevo más tarde.
            </Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => props.navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={styles.errorButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <View style={styles.headerIconContainer}>
          <Icon name="account-edit" size={40} color="#1C9ADD" />
        </View>
        <Text style={styles.headerTitle}>Usuario</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona una opción para continuar
        </Text>
      </Animated.View>

      {/* User Info Badge */}
      <Animated.View
        style={[
          styles.userBadge,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <Icon name="account-check" size={18} color="#4CAF50" />
        <Text style={styles.userName} numberOfLines={1}>
          {user.firstName || 'Cliente'}
        </Text>
        {user.cellPhone && (
          <>
            <View style={styles.userDivider} />
            <Icon name="phone" size={14} color="#666" />
            <Text style={styles.userPhone}>{user.cellPhone}</Text>
          </>
        )}
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonsContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        {/* Editar Usuario */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('UpdateUser', {
              user,
            })
          }
          activeOpacity={0.85}>
          <LinearGradient
            style={styles.actionButtonGradient}
            colors={['#1C9ADD', '#0D7FBF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={styles.actionIconContainer}>
              <Icon name="account-edit" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionButtonTitle}>Editar Usuario</Text>
              <Text style={styles.actionButtonSubtitle}>
                Modificar datos personales
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Editar Vehículo */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('UpdateVehicle', {
              item: user,
            })
          }
          activeOpacity={0.85}>
          <LinearGradient
            style={styles.actionButtonGradient}
            colors={['#4CAF50', '#388E3C']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={styles.actionIconContainer}>
              <Icon name="car-cog" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionButtonTitle}>Editar Vehículo</Text>
              <Text style={styles.actionButtonSubtitle}>
                Modificar datos del vehículo
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Habilitar/Deshabilitar */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('EnableVehicle', {
              item: user,
            })
          }
          activeOpacity={0.85}>
          <LinearGradient
            style={styles.actionButtonGradient}
            colors={['#FF9800', '#F57C00']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={styles.actionIconContainer}>
              <Icon name="car-off" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionButtonTitle}>
                Habilitar/Deshabilitar
              </Text>
              <Text style={styles.actionButtonSubtitle}>
                Gestionar estado del vehículo
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Back Button */}
      <Animated.View
        style={[
          styles.backButtonContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={20} color="#666" />
          <Text style={styles.backButtonText}>Volver a usuarios</Text>
        </TouchableOpacity>
      </Animated.View>
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
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    width: width * 0.85,
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
    color: '#E53935',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
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
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
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
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    maxWidth: 120,
  },
  userDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
  },
  userPhone: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  buttonsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  actionButton: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  backButtonContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
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
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default HandlerEdit;
