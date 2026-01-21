import {configureStore} from '@reduxjs/toolkit';
import RootReducer from './reducers/rootReducer';
import {ILoggedUser} from './interfaces/loggedUserInterface';
import {IActiveSession} from './interfaces/activeSessionInterface';
import {IGeneralConfigurations} from './interfaces/generalConfigurationsInterface';
import {IAlertState} from './interfaces/alertReducerInterface';
import {CameraState} from './interfaces/cameraActiveInterface';
import {CurrentPlatesState} from './interfaces/currentPlatesInterface';
import {DataBasicState} from './interfaces/dataBasicInterface';
import {HandlerFormRegisterState} from './interfaces/handlerFormRegisterInterface';
import { HandlerHceSessionState } from './interfaces/handlerHceSessionInterface';
import { HandlerNfcMaintenanceState } from './interfaces/handlerNfcMaintenanceInterface';
import { IntervalsRef } from './interfaces/intervalsRefInterface';
import { KeyboardState } from './interfaces/keyboardSliceInterface';
import { KeyState } from './interfaces/keyInterface';
import { NfcEnabledState } from './interfaces/nfcEnabledInterface';
import { RoutesState } from './interfaces/routesInterface';
import { IServices } from './interfaces/servicesInterface';
import { AuthTokenState } from './interfaces/authTokenInterface';
export interface IStore {
  alerts: IAlertState;
  activeSession: IActiveSession;
  generalConfigurations: IGeneralConfigurations;
  loggedUser: ILoggedUser;
  cameraActiveGlobal: CameraState;
  currentPlates: CurrentPlatesState;
  dataBasic: DataBasicState;
  handlerFormRegister: HandlerFormRegisterState;
  handlerFormRegisterSuccess: HandlerFormRegisterState;
  handlerActivation: HandlerFormRegisterState;
  handlerHceSession: HandlerHceSessionState,
  handlerNfcMaintenance:HandlerNfcMaintenanceState,
  intervalsRef: IntervalsRef,
  keyboardState: KeyboardState,
  key:KeyState,
  nfcEnabled:NfcEnabledState,
  routes:RoutesState,
  services:IServices,
  authToken:AuthTokenState
}
const Store = configureStore<IStore>({
  reducer: RootReducer,
});

export default Store;
