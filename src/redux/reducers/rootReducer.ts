import activeSessionSlice from '../states/activeSessionState';
import alertSlice from '../states/alertsReducerState';
import cameraSlice from '../states/cameraActiveSlice';
import currentPlatesSlice from '../states/currentPlatesSlice';
import dataBasicSlice from '../states/dataBasicSlice';
import generalConfigurationsSlice from '../states/generalConfigurationsState';
import {
  handlerActivationReducer,
  handlerFormRegisterReducer,
  handlerFormRegisterSuccessReducer,
} from '../states/handlerFormRegisterSlice';
import handlerHceSessionSlice from '../states/handlerHceSessionSlice';
import handlerNfcMaintenanceSlice from '../states/handlerNfcMaintenanceSlice';
import intervalsRefSlice from '../states/intervalsRefSlice';
import keyboardSlice from '../states/keyboardSlice';
import keySlice from '../states/keySlice';
import loggedUserSlice from '../states/loggedUserState';
import nfcEnabledSlice from '../states/nfcEnabledSlice';
import routesSlice from '../states/routesSlice';
import servicesSlice from '../states/servicesSlice';
import authTokenSlice from '../states/authTokenSlice';
const RootReducer = {
  loggedUser: loggedUserSlice,
  activeSession: activeSessionSlice,
  authToken:authTokenSlice,
  generalConfigurations: generalConfigurationsSlice,
  alerts: alertSlice,
  cameraActiveGlobal: cameraSlice,
  currentPlates: currentPlatesSlice,
  dataBasic: dataBasicSlice,
  handlerFormRegister: handlerFormRegisterReducer,
  handlerFormRegisterSuccess: handlerFormRegisterSuccessReducer,
  handlerActivation: handlerActivationReducer,
  handlerHceSession: handlerHceSessionSlice,
  handlerNfcMaintenance: handlerNfcMaintenanceSlice,
  intervalsRef: intervalsRefSlice,
  keyboardState: keyboardSlice,
  key: keySlice,
  nfcEnabled: nfcEnabledSlice,
  routes: routesSlice,
  services:servicesSlice,
};

export default RootReducer;
