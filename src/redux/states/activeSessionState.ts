// slices/loggedUserSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IActiveSession} from '../interfaces/activeSessionInterface';

const initialState: IActiveSession = {
  active: '',
};

const activeSessionSlice = createSlice({
  name: 'activesession',
  initialState,
  reducers: {
    activeSessionAction: (state, action: PayloadAction<IActiveSession>) => {
      return action.payload;
    },
  },
});

export const {activeSessionAction} = activeSessionSlice.actions;

export default activeSessionSlice.reducer;
