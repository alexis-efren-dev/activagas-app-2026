import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CurrentPlatesState} from '../interfaces/currentPlatesInterface';

const initialState: CurrentPlatesState = {
  plates: '',
};

const currentPlatesSlice = createSlice({
  name: 'currentPlates',
  initialState,
  reducers: {
    currentPlatesAction(state, action: PayloadAction<string>) {
      state.plates = action.payload;
    },
  },
});

export const {currentPlatesAction} = currentPlatesSlice.actions;
export default currentPlatesSlice.reducer;
