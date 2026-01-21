import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAlertState } from '../interfaces/alertReducerInterface';



const initialState: IAlertState = {
  message: '',
  show: false,
  messageError: '',
  showError: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    getAlertSuccess(state, action: PayloadAction<IAlertState>) {
      return action.payload;
    },
    getAlertError(state, action: PayloadAction<IAlertState>) {
      return action.payload;
    },
  },
});

export const { getAlertError, getAlertSuccess } = alertSlice.actions;
export default alertSlice.reducer;
