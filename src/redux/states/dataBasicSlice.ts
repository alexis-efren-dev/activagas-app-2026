import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataBasicState } from '../interfaces/dataBasicInterface';


const initialState: DataBasicState = {
  content: '',
};

const dataBasicSlice = createSlice({
  name: 'dataBasic',
  initialState,
  reducers: {
    dataBasicAction(state, action: PayloadAction<any>) {
      state.getVehicleBasicInformationResolver = action.payload;
    },
  },
});

export const { dataBasicAction } = dataBasicSlice.actions;
export default dataBasicSlice.reducer;
