import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KeyState } from '../interfaces/keyInterface';



const initialState: KeyState = {
  key: '',
};

const keySlice = createSlice({
  name: 'key',
  initialState,
  reducers: {
    getKey(state, action: PayloadAction<{ key: string }>) {
      state.key = action.payload.key;
    },
  },
});

export const { getKey } = keySlice.actions;
export default keySlice.reducer;
