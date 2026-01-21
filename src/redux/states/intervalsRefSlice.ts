import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IntervalsRef } from '../interfaces/intervalsRefInterface';

const initialState: IntervalsRef = {
  intervalWork: false,
  intervalTokenWithWork: false,
  intervalToken: false,
};

const intervalsRefSlice = createSlice({
  name: 'intervalsRef',
  initialState,
  reducers: {
    intervalsRefAction(state, action: PayloadAction<Partial<IntervalsRef>>) {
      // Se actualiza el estado combinándolo con el payload
      Object.assign(state, action.payload);
    },
  },
});

export const { intervalsRefAction } = intervalsRefSlice.actions;
export default intervalsRefSlice.reducer;
