/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DynamicForm} from '../../../Components/DynamicForms/DynamicForm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useQueryGetInfoToEdit} from '../../../services/Accounting/useQueryGetInfoToEdit';
import dataFormEditUser from '../../../DataForms/dataFormUpdateProfile.json';
import {useMutationEditToClient} from '../../../services/Accounting/useMutationEditToClient';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IStore} from '../../../redux/store';
import {getAlertSuccess} from '../../../redux/states/alertsReducerState';

const {width} = Dimensions.get('screen');

const buttonInfo = {
  style: {
    marginVertical: 10,
    width: width * 0.85,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentStyle: {
    paddingVertical: 8,
  },
  buttonColor: '#1C9ADD',
  mode: 'contained',
};

const UpdateProfile = (props: any) => {
  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const dispatch = useDispatch();

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
  const [parsedJson, setParsedJson] = React.useState<any>(false);

  const {data, error, isLoading, refetch, isFetching} =
    useQueryGetInfoToEdit(dataVariables);
  const {isPending: isLoadingMutation, mutate} = useMutationEditToClient();

  React.useEffect(() => {
    if (userRedux) {
      setDataVariables({
        idGas: userRedux.idGas,
        cellPhone: userRedux.cellPhone,
      });
    }
  }, [userRedux]);

  React.useEffect(() => {
    if (dataVariables) {
      refetch();
    }
  }, [dataVariables]);

  React.useEffect(() => {
    if (data && data.getInfoToEditUserResolver) {
      const transformJson = JSON.stringify(dataFormEditUser);
      const revertJson = JSON.parse(transformJson);
      const parsedData = data.getInfoToEditUserResolver;
      const getKeys = Object.keys(parsedData);
      for (let i = 0; i < revertJson.length; i++) {
        if (getKeys.includes(revertJson[i].name)) {
          if (revertJson[i].name === 'email') {
            if (parsedData[revertJson[i].name] === '') {
              revertJson[i].value = 'Email no registrado';
            }
          } else {
            revertJson[i].value = String(parsedData[revertJson[i].name]);
          }
        }
      }
      setIsWithWhatsapp(parsedData.whatsapp);
      setParsedJson(revertJson);
    }
  }, [data]);

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
        email:
          dataToUpdate.email === 'Email no registrado'
            ? ''
            : dataToUpdate.email,
        whatsapp: isWithWhatsapp,
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C9ADD" />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient style={styles.container} colors={['#074169', '#019CDE']}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Icon name="alert-circle-outline" size={48} color="#E53935" />
            </View>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>
              No se pudo cargar tu perfil.{'\n'}Inténtalo más tarde.
            </Text>
            <TouchableOpacity
              style={styles.backButtonError}
              onPress={() => props.navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-left" size={20} color="#1C9ADD" />
              <Text style={styles.backButtonErrorText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
            <Icon name="account-edit" size={40} color="#1C9ADD" />
          </View>
          <Text style={styles.headerTitle}>EDITAR PERFIL</Text>
          <Text style={styles.headerSubtitle}>
            Actualiza tu información personal
          </Text>
        </View>

        {/* Form */}
        {parsedJson ? (
          <View style={styles.formContainer}>
            <DynamicForm
              onSubmit={handlerSubmit}
              isLoading={isLoadingMutation}
              json={parsedJson}
              labelSubmit="Actualizar"
              buttonProps={buttonInfo}>
              {/* WhatsApp Toggle */}
              <View style={styles.whatsappContainer}>
                <View style={styles.whatsappIconContainer}>
                  <Icon name="whatsapp" size={24} color="#25D366" />
                </View>
                <Text style={styles.whatsappLabel}>WhatsApp</Text>
                <Switch
                  value={isWithWhatsapp}
                  onValueChange={setIsWithWhatsapp}
                  trackColor={{false: '#E0E0E0', true: '#A5D6A7'}}
                  thumbColor={isWithWhatsapp ? '#4CAF50' : '#BDBDBD'}
                />
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => props.navigation.goBack()}
                activeOpacity={0.8}>
                <LinearGradient
                  style={styles.cancelButtonGradient}
                  colors={['#78909C', '#546E7A']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="close" size={20} color="#FFFFFF" />
                  <Text style={styles.cancelButtonText}>CANCELAR</Text>
                </LinearGradient>
              </TouchableOpacity>
            </DynamicForm>
          </View>
        ) : null}
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
  backButtonError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonErrorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C9ADD',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  whatsappContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  whatsappIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: width * 0.85,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cancelButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default UpdateProfile;
