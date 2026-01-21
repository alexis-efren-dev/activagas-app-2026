import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KeyboardState } from '../interfaces/keyboardSliceInterface';


const initialState: KeyboardState = {
  isOpen: false,
};

const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  reducers: {
    getKeyboard(state, action: PayloadAction<{ isOpen: boolean }>) {
      state.isOpen = action.payload.isOpen;
    },
  },
});

export const { getKeyboard } = keyboardSlice.actions;
export default keyboardSlice.reducer;
