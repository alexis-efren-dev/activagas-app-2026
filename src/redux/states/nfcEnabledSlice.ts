import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NfcEnabledState } from '../interfaces/nfcEnabledInterface';


const initialState: NfcEnabledState = {
  enabled: true,
};

const nfcEnabledSlice = createSlice({
  name: 'nfcEnabled',
  initialState,
  reducers: {
    nfcEnabledAction(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
    },
  },
});

export const { nfcEnabledAction } = nfcEnabledSlice.actions;
export default nfcEnabledSlice.reducer;
