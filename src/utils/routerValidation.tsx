/**
 * Router Validation Component
 *
 * Handles authentication flow and role-based routing:
 * - JWT token validation and refresh
 * - Work session time limits
 * - Role-based route selection (RBAC)
 * - NFC/HCE session initialization
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQueryClient} from '@tanstack/react-query';
import {useEffect, useRef, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {
  IDACCOUNTING,
  IDACTIVATORS,
  IDCLIENT,
  IDGASERA,
  IDMAINTENANCE,
  IDSERIAL,
  IDVERIFICATIONUNIT,
} from '../Catalogs/roles';
import useDataLayer from '../hooks/useDataLayer';
import {activeSessionAction} from '../redux/states/activeSessionState';
import {getAlertSuccess} from '../redux/states/alertsReducerState';
import {setAuthToken} from '../redux/states/authTokenSlice';
import {intervalsRefAction} from '../redux/states/intervalsRefSlice';
import {loggedUserAction} from '../redux/states/loggedUserState';
import {IStore} from '../redux/store';
import RoutesAccounting from '../routes/RoutesAccounting';
import RoutesAuth from '../routes/RoutesAuth';
import RoutesClient from '../routes/RoutesClient';
import RoutesGasera from '../routes/RoutesGasera';
import RoutesMaintenance from '../routes/RoutesMaintenance';
import RoutesNoAuth from '../routes/RoutesNoAuth';
import RoutesStock from '../routes/RoutesStock';
import RoutesVerification from '../routes/RoutesVerification';
import {useQueryAuth} from '../services/Login/Auth';
import {useMutationRefreshTokenResolver} from '../services/Login/RefreshToken';
import {
  AUTH_STORAGE_KEYS,
  clearAuthTokens,
  decodeTokenUserId,
  getTokenExpirationMs,
  NO_WORK_TIME_LIMIT,
  saveSessionId,
  WORK_SESSION_END_MESSAGE,
} from './authHelpers';
import {customTypeError} from './customTypeError';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * Main router validation component
 * Handles authentication state and routes to appropriate screen based on user role
 */
const RouterValidation = () => {
  const client = useQueryClient();
  const dispatch = useDispatch();

  // Interval refs for session timers
  const workTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenWithWorkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // NFC session control - memoize callback to prevent infinite loops
  const terminateCallback = useCallback(() => {
    // No-op callback - maintained for hook compatibility
  }, []);
  const {switchSession, updateProp} = useDataLayer({terminate: terminateCallback});

  // Auth state
  const activeSession = useSelector((store: IStore) => store.activeSession);
  const [token, setToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const [verifyId, setVerifyId] = useState<string>('');
  const [controllerId, setControllerId] = useState<number>(0);

  // Auth queries
  const {isLoading, refetch, data} = useQueryAuth(token);
  const {
    mutate,
    reset: resetMutation,
    data: dataMutation,
  } = useMutationRefreshTokenResolver();

  /**
   * Save session info to AsyncStorage
   */
  const saveInfoSession = async (dataSession: any) => {
    const {_id, idGas} = dataSession.verifyAuthResolver;
    await saveSessionId(_id, idGas);
  };

  /**
   * Load auth tokens from storage and update state
   */
  const getAuthToken = async (): Promise<void> => {
    const getToken = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.AUTH_TOKEN);
    const getRefreshToken = await AsyncStorage.getItem(
      AUTH_STORAGE_KEYS.REFRESH_TOKEN,
    );

    if (getToken && getRefreshToken) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.AUTH_TOKEN_USER, getToken);
      dispatch(setAuthToken(getToken));
      setToken(getToken);
      setRefreshToken(getRefreshToken);

      if (activeSession.active === '') {
        dispatch(activeSessionAction({active: getToken}));
      }
    } else {
      setToken('');
      setVerifyId('');
    }
  };

  /**
   * Show error alert and clear session
   */
  const handleAuthError = async (errorMessage: string) => {
    dispatch(
      getAlertSuccess({
        message: '',
        show: false,
        messageError: errorMessage,
        showError: true,
      }),
    );
    await clearAuthTokens();
    dispatch(activeSessionAction({active: ''}));
  };

  /**
   * Setup work time expiration interval
   */
  const setupWorkTimeInterval = (leavingWorkTime: number) => {
    workTimeIntervalRef.current = setInterval(async () => {
      // Clear all intervals
      if (tokenWithWorkIntervalRef.current) {
        clearInterval(tokenWithWorkIntervalRef.current);
      }
      if (workTimeIntervalRef.current) {
        clearInterval(workTimeIntervalRef.current);
      }

      await handleAuthError(
        customTypeError({
          response: {
            errors: [{message: WORK_SESSION_END_MESSAGE}],
          },
        }),
      );
    }, leavingWorkTime * 1000);
  };

  /**
   * Setup token expiration interval (with work time)
   */
  const setupTokenWithWorkInterval = () => {
    const expirationMs = getTokenExpirationMs(token);

    tokenWithWorkIntervalRef.current = setInterval(() => {
      if (workTimeIntervalRef.current) {
        clearInterval(workTimeIntervalRef.current);
      }
      if (tokenWithWorkIntervalRef.current) {
        clearInterval(tokenWithWorkIntervalRef.current);
      }
      setIsExpiredToken(true);
    }, expirationMs);
  };

  /**
   * Setup token expiration interval (without work time)
   */
  const setupTokenOnlyInterval = () => {
    const expirationMs = getTokenExpirationMs(token);

    tokenIntervalRef.current = setInterval(() => {
      if (tokenIntervalRef.current) {
        clearInterval(tokenIntervalRef.current);
      }
      setIsExpiredToken(true);
    }, expirationMs);
  };

  /**
   * Verify auth token and setup session timers
   */
  const awaitRefetch = async () => {
    try {
      const verifyData: any = await refetch();

      if (!verifyData.data) {
        // Check for permission error
        if (verifyData.error?.message?.indexOf('Tus permisos') > -1) {
          await handleAuthError(customTypeError(verifyData.error));
          // TODO: Be careful, this sometimes removes deviceId from AsyncStorage on logout
          return;
        }
        setIsExpiredToken(true);
        return;
      }

      // Token is valid - setup expiration timers
      const {leavingWorkTime} = verifyData.data.verifyAuthResolver;

      if (leavingWorkTime !== NO_WORK_TIME_LIMIT) {
        // User has work time limit
        setupWorkTimeInterval(leavingWorkTime);
        setupTokenWithWorkInterval();

        dispatch(
          intervalsRefAction({
            intervalWork: workTimeIntervalRef.current,
            intervalTokenWithWork: tokenWithWorkIntervalRef.current,
          }),
        );
      } else {
        // No work time limit - only track token expiration
        setupTokenOnlyInterval();

        dispatch(
          intervalsRefAction({
            intervalToken: tokenIntervalRef.current,
          }),
        );
      }

      setIsExpiredToken(false);
    } catch {
      setIsExpiredToken(true);
    }
  };

  // Effect: Load tokens when session changes
  useEffect(() => {
    setControllerId(0);
    getAuthToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession]);

  // Effect: Verify token when loaded
  useEffect(() => {
    if (token !== '') {
      client.removeQueries({queryKey: ['auth']});
      resetMutation();
      awaitRefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Effect: Handle successful auth verification
  useEffect(() => {
    if (data && controllerId === 0) {
      const authData = data as any;

      // Initialize NFC session
      switchSession(true);
      updateProp('content', 'init');

      // Set user role and info
      setVerifyId(authData.verifyAuthResolver.idRol);
      setControllerId(1);
      saveInfoSession(data);

      dispatch(
        loggedUserAction({
          _id: authData.verifyAuthResolver._id,
          idRol: authData.verifyAuthResolver.idRol,
          cellPhone: authData.verifyAuthResolver.cellPhone,
          idGas: authData.verifyAuthResolver.idGas,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Effect: Refresh expired token
  useEffect(() => {
    if (isExpiredToken && refreshToken) {
      const userId = decodeTokenUserId(token);
      mutate({
        idGas: userId,
        refreshToken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpiredToken, refreshToken]);

  // Effect: Handle token refresh success
  useEffect(() => {
    if (dataMutation) {
      setIsExpiredToken(false);
      getAuthToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMutation]);

  // ============================================
  // Render: Loading State
  // ============================================
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={'red'} />
      </View>
    );
  }

  // ============================================
  // Render: No Auth - Show Login
  // ============================================
  if (activeSession.active === '') {
    return <RoutesNoAuth />;
  }

  // ============================================
  // Render: Role-Based Routing (RBAC)
  // ============================================
  if (verifyId === IDGASERA) {
    return <RoutesGasera />;
  }
  if (verifyId === IDACTIVATORS) {
    return <RoutesAuth />;
  }
  if (verifyId === IDACCOUNTING) {
    return <RoutesAccounting />;
  }
  if (verifyId === IDVERIFICATIONUNIT) {
    return <RoutesVerification />;
  }
  if (verifyId === IDMAINTENANCE) {
    return <RoutesMaintenance />;
  }
  if (verifyId === IDSERIAL) {
    return <RoutesStock />;
  }
  if (verifyId === IDCLIENT) {
    return <RoutesClient />;
  }

  // ============================================
  // Render: Default Loading (transitioning)
  // ============================================
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} color={'red'} />
    </View>
  );
};

export default RouterValidation;
