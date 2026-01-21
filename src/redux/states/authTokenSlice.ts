import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthTokenState} from '../interfaces/authTokenInterface';

const initialState: AuthTokenState = {
  token: '',
};

const authTokenSlice = createSlice({
  name: 'authToken',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const {setAuthToken} = authTokenSlice.actions;
export default authTokenSlice.reducer;
