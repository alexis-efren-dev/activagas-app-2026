import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HandlerHceSessionState } from '../interfaces/handlerHceSessionInterface';


const initialState: HandlerHceSessionState = {
  isEnabled: false,
};

const handlerHceSessionSlice = createSlice({
  name: 'handlerHceSession',
  initialState,
  reducers: {
    handlerHceSessionAction(state, action: PayloadAction<boolean>) {
      // Gracias a Immer, podemos modificar el estado "mutándolo" directamente
      state.isEnabled = action.payload;
    },
  },
});

export const { handlerHceSessionAction } = handlerHceSessionSlice.actions;
export default handlerHceSessionSlice.reducer;
