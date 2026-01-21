import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { CameraState } from '../interfaces/cameraActiveInterface';



const initialState: CameraState = {
  isCameraGlobalActive: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    cameraActiveAction(state, action: PayloadAction<boolean>) {
      return {isCameraGlobalActive: action.payload};
    },
  },
});

export const {cameraActiveAction} = cameraSlice.actions;
export default cameraSlice.reducer;
