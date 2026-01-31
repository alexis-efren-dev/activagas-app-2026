/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  Switch,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {DynamicForm} from '../../Components/DynamicForms/DynamicForm';
import {makeStyles} from '../../Components/Login/customStyles/FormLogin';
import dataFormEditUser from '../../DataForms/dataFormEditUser.json';
import {useMutationEditToClient} from '../../services/Accounting/useMutationEditToClient';
import {useQueryGetInfoToEdit} from '../../services/Accounting/useQueryGetInfoToEdit';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';
import {IStore} from '../../redux/store';

const {width} = Dimensions.get('screen');

const buttonInfo = {
  style: makeStyles.stylesButton,
  contentStyle: makeStyles.stylesButtonContent,
  buttonColor: '#1C9ADD',
  mode: 'contained',
};

const UpdateUser = (props: any) => {
  const [user, setUser] = React.useState<any>(false);
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const dispatch = useDispatch();

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

  const dispatchErrors = (message: string) => {
    dispatch(
      getAlertSuccess({
        message: '',
        show: false,
        messageError: message,
        showError: true,
      }),
    );
  };
  const [dataVariables, setDataVariables] = React.useState<any>(false);
  const [isWithWhatsapp, setIsWithWhatsapp] = React.useState<boolean>(false);
  const onWithWhatsapp = () => setIsWithWhatsapp(!isWithWhatsapp);
  const [parsedJson, setParsedJson] = React.useState<any>(false);
  const {data, error, isLoading, refetch, isFetching} =
    useQueryGetInfoToEdit(dataVariables);
  const {isPending: isLoadingMutation, mutate} = useMutationEditToClient();

  useEffect(() => {
    if (props) {
      if (props.route) {
        if (props.route.params) {
          if (props.route.params.user) {
            setUser(props.route.params.user);
          } else {
            setUser('');
          }
        }
      }
    }
  }, [props]);

  useEffect(() => {
    if (user && userRedux) {
      setDataVariables({
        idGas: userRedux.idGas,
        cellPhone: user.cellPhone,
      });
    }
  }, [user, userRedux]);

  useEffect(() => {
    if (dataVariables) {
      refetch();
    }
  }, [dataVariables]);

  useEffect(() => {
    if (data && data.getInfoToEditUserResolver) {
      const transformJson = JSON.stringify(dataFormEditUser);
      const revertJson = JSON.parse(transformJson);
      const parsedData = data.getInfoToEditUserResolver;
      const getKeys = Object.keys(parsedData);
      for (let i = 0; i < revertJson.length; i++) {
        if (getKeys.includes(revertJson[i].name)) {
          revertJson[i].value = String(parsedData[revertJson[i].name]);
        }
      }
      setIsWithWhatsapp(parsedData.whatsapp);
      setParsedJson(revertJson);
    }
  }, [data]);

  if (user === '' || error) {
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

  if (isLoading || isFetching || !parsedJson) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const handlerSubmit = (dataToUpdate: any) => {
    if (dataToUpdate.password !== dataToUpdate.confirmPassword) {
      dispatchErrors('Las contraseñas deben ser iguales');
    } else {
      mutate({
        idGas: userRedux.idGas,
        _id: data.getInfoToEditUserResolver._id,
        cellPhone: Number(dataToUpdate.cellPhone),
        password: dataToUpdate.password,
        state: dataToUpdate.state,
        municipality: dataToUpdate.municipality,
        location: dataToUpdate.location,
        firstName: dataToUpdate.firstName,
        lastName: dataToUpdate.lastName,
        email: dataToUpdate.email,
        whatsapp: isWithWhatsapp,
      });
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.headerTitle}>Editar Usuario</Text>
          <Text style={styles.headerSubtitle}>
            Modifica los datos del cliente
          </Text>
        </Animated.View>

        {/* User Badge */}
        <Animated.View
          style={[
            styles.userBadge,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Icon name="account" size={16} color="#1C9ADD" />
          <Text style={styles.userBadgeText}>
            {user.firstName || user.cellPhone || 'Usuario'}
          </Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.formCard,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <DynamicForm
            onSubmit={handlerSubmit}
            isLoading={isLoadingMutation}
            json={parsedJson}
            labelSubmit="Actualizar"
            buttonProps={buttonInfo}>
            {/* WhatsApp Switch */}
            <View style={styles.whatsappContainer}>
              <View style={styles.whatsappRow}>
                <View style={styles.whatsappLabel}>
                  <View
                    style={[
                      styles.whatsappIcon,
                      {backgroundColor: isWithWhatsapp ? '#E8F5E9' : '#F5F5F5'},
                    ]}>
                    <Icon
                      name="whatsapp"
                      size={20}
                      color={isWithWhatsapp ? '#4CAF50' : '#9E9E9E'}
                    />
                  </View>
                  <Text style={styles.whatsappText}>WhatsApp</Text>
                </View>
                <Switch
                  value={isWithWhatsapp}
                  onValueChange={onWithWhatsapp}
                  trackColor={{false: '#E0E0E0', true: '#A5D6A7'}}
                  thumbColor={isWithWhatsapp ? '#4CAF50' : '#BDBDBD'}
                />
              </View>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => props.navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="close" size={20} color="#E53935" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </DynamicForm>
        </Animated.View>
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
    paddingBottom: 40,
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
    fontSize: 26,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
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
  userBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
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
  whatsappContainer: {
    marginBottom: 20,
  },
  whatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
  },
  whatsappLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whatsappIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53935',
  },
});

export default UpdateUser;
