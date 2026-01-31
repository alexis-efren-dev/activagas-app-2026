/**
 * Authentication Helper Functions
 *
 * Extracted from routerValidation.tsx for better maintainability.
 * These functions handle token management, session storage, and interval cleanup.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

/**
 * Token storage keys
 */
export const AUTH_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  AUTH_TOKEN_USER: 'authTokenUser',
  LOOK: 'look',
} as const;

/**
 * JWT payload structure
 */
export interface JWTPayload {
  exp: number;
  idUser: string;
  [key: string]: any;
}

/**
 * Auth verification response structure
 */
export interface VerifyAuthResponse {
  verifyAuthResolver: {
    _id: string;
    idRol: string;
    cellPhone: string;
    idGas: string;
    leavingWorkTime: number;
  };
}

/**
 * Get stored authentication tokens
 */
export const getStoredTokens = async (): Promise<{
  authToken: string | null;
  refreshToken: string | null;
}> => {
  const [authToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem(AUTH_STORAGE_KEYS.AUTH_TOKEN),
    AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
  ]);
  return {authToken, refreshToken};
};

/**
 * Clear all authentication tokens from storage
 */
export const clearAuthTokens = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_TOKEN),
    AsyncStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
  ]);
};

/**
 * Save session identifier to storage
 */
export const saveSessionId = async (
  userId: string,
  gasId: string,
): Promise<void> => {
  const lookValue = gasId === '' ? userId : gasId;
  await AsyncStorage.setItem(AUTH_STORAGE_KEYS.LOOK, lookValue);
};

/**
 * Calculate milliseconds until JWT token expires
 */
export const getTokenExpirationMs = (token: string): number => {
  const decoded = jwtDecode<JWTPayload>(token);
  const expirationTime = decoded.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  return (expirationTime - currentTime) * 1000;
};

/**
 * Decode JWT and extract user ID
 */
export const decodeTokenUserId = (token: string): string => {
  const decoded = jwtDecode<JWTPayload>(token);
  return decoded.idUser;
};

/**
 * Clear multiple intervals safely
 */
export const clearIntervals = (
  ...refs: React.MutableRefObject<NodeJS.Timeout | null>[]
): void => {
  refs.forEach((ref) => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  });
};

/**
 * Work session end message
 */
export const WORK_SESSION_END_MESSAGE = 'Tu horario de trabajo ha finalizado';

/**
 * Value indicating no work time limit (-360 = no limit)
 */
export const NO_WORK_TIME_LIMIT = -360;
