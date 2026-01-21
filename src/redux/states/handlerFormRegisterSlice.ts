import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HandlerFormRegisterState } from '../interfaces/handlerFormRegisterInterface';

const initialState: HandlerFormRegisterState = {
  validation: false,
};

/* ================================
   Slice 1: handlerFormRegisterSlice
   Maneja la acción HANDLERFORMREGISTER
   ================================= */
const handlerFormRegisterSlice = createSlice({
  name: 'handlerFormRegister',
  initialState,
  reducers: {
    handlerFormRegisterAction(state, action: PayloadAction<boolean>) {
      state.validation = action.payload;
    },
  },
});

export const { handlerFormRegisterAction } = handlerFormRegisterSlice.actions;
export const handlerFormRegisterReducer = handlerFormRegisterSlice.reducer;

/* ==========================================
   Slice 2: handlerFormRegisterSuccessSlice
   Maneja la acción HANDLERFORMREGISTERSUCCESS
   ========================================== */
const handlerFormRegisterSuccessSlice = createSlice({
  name: 'handlerFormRegisterSuccess',
  initialState,
  reducers: {
    handlerFormRegisterActionSuccess(state, action: PayloadAction<boolean>) {
      state.validation = action.payload;
    },
  },
});

export const { handlerFormRegisterActionSuccess } = handlerFormRegisterSuccessSlice.actions;
export const handlerFormRegisterSuccessReducer = handlerFormRegisterSuccessSlice.reducer;

/* ====================================
   Slice 3: handlerActivationSlice
   Maneja la acción HANDLEACTIVATION
   ==================================== */
const handlerActivationSlice = createSlice({
  name: 'handlerActivation',
  initialState,
  reducers: {
    handlerActivation(state, action: PayloadAction<boolean>) {
      state.validation = action.payload;
    },
  },
});

export const { handlerActivation } = handlerActivationSlice.actions;
export const handlerActivationReducer = handlerActivationSlice.reducer;
