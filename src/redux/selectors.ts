/**
 * Redux Selectors - Centralized and Memoized
 *
 * Benefits:
 * - Reusable across components
 * - Memoized with createSelector for derived state
 * - Single source of truth for state access
 * - Better TypeScript inference
 */
import {createSelector} from '@reduxjs/toolkit';
import type {IStore} from './store';

// ============================================
// Base Selectors (not memoized, just accessors)
// ============================================
export const selectLoggedUser = (state: IStore) => state.loggedUser;
export const selectAlerts = (state: IStore) => state.alerts;
export const selectActiveSession = (state: IStore) => state.activeSession;
export const selectGeneralConfigurations = (state: IStore) => state.generalConfigurations;
export const selectCameraActiveGlobal = (state: IStore) => state.cameraActiveGlobal;
export const selectCurrentPlates = (state: IStore) => state.currentPlates;
export const selectDataBasic = (state: IStore) => state.dataBasic;
export const selectHandlerFormRegister = (state: IStore) => state.handlerFormRegister;
export const selectHandlerFormRegisterSuccess = (state: IStore) => state.handlerFormRegisterSuccess;
export const selectHandlerActivation = (state: IStore) => state.handlerActivation;
export const selectHandlerHceSession = (state: IStore) => state.handlerHceSession;
export const selectHandlerNfcMaintenance = (state: IStore) => state.handlerNfcMaintenance;
export const selectIntervalsRef = (state: IStore) => state.intervalsRef;
export const selectKeyboardState = (state: IStore) => state.keyboardState;
export const selectKey = (state: IStore) => state.key;
export const selectNfcEnabled = (state: IStore) => state.nfcEnabled;
export const selectRoutes = (state: IStore) => state.routes;
export const selectServices = (state: IStore) => state.services;
export const selectAuthToken = (state: IStore) => state.authToken;

// ============================================
// Derived Selectors (memoized with createSelector)
// ============================================

// User selectors
export const selectUserId = createSelector(
  selectLoggedUser,
  (user) => user._id
);

export const selectUserIdRol = createSelector(
  selectLoggedUser,
  (user) => user.idRol
);

export const selectUserIdGas = createSelector(
  selectLoggedUser,
  (user) => user.idGas
);

export const selectUserCellPhone = createSelector(
  selectLoggedUser,
  (user) => user.cellPhone
);

// NFC selectors
export const selectIsNfcEnabled = createSelector(
  selectNfcEnabled,
  (nfc) => nfc.enabled
);

// Current plates selectors
export const selectPlates = createSelector(
  selectCurrentPlates,
  (current) => current.plates
);

// Services selectors
export const selectServiceSelect = createSelector(
  selectServices,
  (services) => services.serviceSelect
);

export const selectFrequencySelect = createSelector(
  selectServices,
  (services) => services.frequencySelect
);

export const selectMaintenanceSelect = createSelector(
  selectServices,
  (services) => services.maintenanceSelect
);

export const selectLimitPay = createSelector(
  selectServices,
  (services) => services.limitPay
);

export const selectPolicies = createSelector(
  selectServices,
  (services) => services.policies
);

// Alert selectors
export const selectAlertMessage = createSelector(
  selectAlerts,
  (alerts) => alerts.message
);

export const selectAlertShow = createSelector(
  selectAlerts,
  (alerts) => alerts.show
);

export const selectAlertError = createSelector(
  selectAlerts,
  (alerts) => alerts.messageError
);

export const selectAlertShowError = createSelector(
  selectAlerts,
  (alerts) => alerts.showError
);

// Auth selectors
export const selectToken = createSelector(
  selectAuthToken,
  (auth) => auth.token
);

// Camera selectors
export const selectIsCameraGlobalActive = createSelector(
  selectCameraActiveGlobal,
  (camera) => camera.isCameraGlobalActive
);

// Handler form selectors
export const selectFormRegisterValidation = createSelector(
  selectHandlerFormRegister,
  (form) => form.validation
);

// HCE Session selectors
export const selectHceSessionEnabled = createSelector(
  selectHandlerHceSession,
  (hce) => hce.isEnabled
);

// Intervals selectors
export const selectIntervalWork = createSelector(
  selectIntervalsRef,
  (intervals) => intervals.intervalWork
);

export const selectIntervalToken = createSelector(
  selectIntervalsRef,
  (intervals) => intervals.intervalToken
);

// Keyboard selectors
export const selectIsKeyboardOpen = createSelector(
  selectKeyboardState,
  (keyboard) => keyboard.isOpen
);
