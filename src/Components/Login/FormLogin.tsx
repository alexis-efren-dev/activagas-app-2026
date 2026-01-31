import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Linking,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import dataFormLogin from '../../DataForms/dataFormLogin.json';
import {activeSessionAction} from '../../redux/states/activeSessionState';
import {useMutationLogin} from '../../services/Login/Login';
import {DynamicForm} from '../DynamicForms/DynamicForm';
import {IDataLogin} from './types';

const {width} = Dimensions.get('screen');

const FormLogin: React.FC = React.memo((): JSX.Element => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const mutation = useMutationLogin();
  const {data, isError, isPending: isLoading} = mutation;
  const formRef = React.useRef<any>(null);

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

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

  const handleSubmit = async (dataLogin: IDataLogin) => {
    const idDevice = await AsyncStorage.getItem('deviceId');
    mutation.mutate({
      cellPhone: Number(dataLogin.cellPhone),
      password: dataLogin.password,
      idDevice,
    });
  };

  React.useEffect(() => {
    if (data && !isError) {
      dispatch(activeSessionAction({active: data.loginV2Resolver.token}));
    }
  }, [data, isError, dispatch]);

  const buttonInfo = {
    style: {display: 'none'},
    contentStyle: {display: 'none'},
  };

  return (
    <>
      <DynamicForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        json={dataFormLogin}
        labelSubmit=""
        buttonProps={buttonInfo}
        showButton={false}
        formRef={formRef}>
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await Linking.openURL('https://terms.activagas.com');
            }}>
            <Text style={styles.termsText}>Términos y Condiciones</Text>
          </TouchableOpacity>
        </View>
      </DynamicForm>

      <Animated.View
        style={[styles.buttonWrapper, {transform: [{scale: pulseAnim}]}]}>
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
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
              <Icon name="login" size={22} color="#FFFFFF" />
            )}
            <Text style={styles.buttonText}>
              {isLoading ? 'Ingresando...' : 'Entrar'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
});

const styles = StyleSheet.create({
  linksContainer: {
    width: width * 0.9,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  linkText: {
    color: '#1F97DC',
    fontSize: 15,
    fontWeight: '600',
  },
  termsText: {
    color: '#1F97DC',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  loginButton: {
    width: width * 0.65,
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
  loginButtonDisabled: {
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
    letterSpacing: 0.5,
  },
});

export default FormLogin;
