import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IServices } from '../interfaces/servicesInterface';

const initialState: IServices = {
  serviceSelect: '',
  frequencySelect: '',
  maintenanceSelect: '',
  frequencySelectMaintenance: '',
  activationSelect: '',
  frequencySelectActivations: '',
  limitPay: '1',
  policies: [],
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    getServicesStore(state, action: PayloadAction<IServices>) {
      return action.payload;
    },
    getServicesPolicies(state, action: PayloadAction<IServices['policies']>) {
      return {...state, policies: action.payload};
    },
  },
});

export const {getServicesStore, getServicesPolicies} = servicesSlice.actions;
export default servicesSlice.reducer;
