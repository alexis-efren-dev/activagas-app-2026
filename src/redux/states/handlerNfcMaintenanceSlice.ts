import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HandlerNfcMaintenanceState } from '../interfaces/handlerNfcMaintenanceInterface';



const initialState: HandlerNfcMaintenanceState = {
  content: '',
};

const handlerNfcMaintenanceSlice = createSlice({
  name: 'handlerNfcMaintenance',
  initialState,
  reducers: {
    handlerNfcMaintenanceAction(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
  },
});

export const { handlerNfcMaintenanceAction } = handlerNfcMaintenanceSlice.actions;
export default handlerNfcMaintenanceSlice.reducer;
