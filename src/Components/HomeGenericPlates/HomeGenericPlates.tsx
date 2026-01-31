/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import UserInfo from '../../Components/Accounting/UserInfo';
import {DynamicForm} from '../../Components/DynamicForms/DynamicForm';
import UserInfoMaintenance from '../../Components/Maintenance/UserInfo';
import dataForm from '../../DataForms/dataFormPlates.json';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {IStore} from '../../redux/store';
import {useQuerySearchPlates} from '../../services/Accounting/useQuerySearchPlates';
import {customTypeError} from '../../utils/customTypeError';

const {width} = Dimensions.get('screen');

interface Props {
  plates: string;
}

const buttonInfo = {
  style: {display: 'none'},
  contentStyle: {display: 'none'},
};

const HomeGenericPlates = (props: any) => {
  const dispatch = useDispatch();
  const [handlerUserInfo, setHandlerUserInfo] = useState<any>(false);
  const client = useQueryClient();
  const {idGas} = useSelector((store: IStore) => store.loggedUser);
  const [dataVariables, setDataVariables] = useState({
    idGas,
    plates: '',
  });
  const {isLoading, refetch} = useQuerySearchPlates(dataVariables);
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

  const handleSubmit = (data: Props) => {
    if (props.verification) {
      setDataVariables({
        ...dataVariables,
        plates: data.plates,
        idGas: props.verification,
      });
    } else {
      setDataVariables({
        ...dataVariables,
        plates: data.plates,
      });
    }
  };

  const refetchData = async () => {
    try {
      const response: any = await refetch();
      if (!response.data) {
        dispatch(
          getAlertSuccess({
            message: customTypeError(response.error),
            show: true,
            messageError: '',
            showError: false,
          }),
        );
        return;
      }
      setHandlerUserInfo(response.data.searchPlatesResolver);
    } catch (e: any) {
      dispatch(
        getAlertSuccess({
          message: 'Error al obtener',
          show: true,
          messageError: '',
          showError: false,
        }),
      );
    }
  };

  useEffect(() => {
    if (dataVariables.plates !== '') {
      refetchData();
    }
  }, [dataVariables]);

  useEffect(() => {
    if (handlerUserInfo) {
      client.removeQueries({queryKey: ['searchPlatesResolver']});
      if (props.verification) {
        props.navigation.navigate('VerifyUnit', {
          item: handlerUserInfo,
        });
      }
    }
  }, [handlerUserInfo]);

  useEffect(() => {
    if (props.refresh) {
      setHandlerUserInfo(false);
    }
  }, [props]);

  // Get header content based on mode
  const getHeaderContent = () => {
    if (props.accounting) {
      return {
        icon: 'card-search-outline',
        title: 'Buscar Placas',
        subtitle: 'Ingresa las placas para realizar el pago',
        badgeText: 'Módulo de Pago',
        badgeIcon: 'cash',
      };
    } else if (props.verification) {
      return {
        icon: 'shield-search',
        title: 'Verificar Unidad',
        subtitle: 'Ingresa las placas para verificar la unidad',
        badgeText: 'Verificación',
        badgeIcon: 'shield-check',
      };
    } else {
      return {
        icon: 'wrench',
        title: 'Mantenimiento',
        subtitle: 'Ingresa las placas para dar mantenimiento',
        badgeText: 'Mantenimiento',
        badgeIcon: 'tools',
      };
    }
  };

  const headerContent = getHeaderContent();

  if (handlerUserInfo) {
    if (props.accounting) {
      return (
        <UserInfo
          cancelAction={() => setHandlerUserInfo(false)}
          user={handlerUserInfo}
          navigation={props.navigation}
        />
      );
    } else if (!props.accounting && !props.verification) {
      return (
        <UserInfoMaintenance
          cancelAction={() => setHandlerUserInfo(false)}
          user={handlerUserInfo}
          navigation={props.navigation}
        />
      );
    }
  }

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name={headerContent.icon} size={36} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>{headerContent.title}</Text>
          <Text style={styles.headerSubtitle}>{headerContent.subtitle}</Text>
        </View>

        {/* Badge */}
        <View style={styles.badge}>
          <Icon name={headerContent.badgeIcon} size={16} color="#1C9ADD" />
          <Text style={styles.badgeText}>{headerContent.badgeText}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <DynamicForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            json={dataForm}
            labelSubmit=""
            buttonProps={buttonInfo}
            showButton={false}
            formRef={formRef}
          />

          {/* Search Button */}
          <Animated.View
            style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={() => formRef.current?.handleSubmit()}
              disabled={isLoading}
              activeOpacity={0.8}>
              <LinearGradient
                style={styles.buttonGradient}
                colors={isLoading ? ['#666', '#888'] : ['#1C9ADD', '#0D7ABC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Icon name="magnify" size={22} color="#FFFFFF" />
                )}
                <Text style={styles.buttonText}>
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Cancel Button (only for verification mode) */}
          {!!props.verification && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => props.navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="close" size={20} color="#E53935" />
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
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
  badge: {
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
  badgeText: {
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
        shadowColor: '#1C9ADD',
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

export default HomeGenericPlates;
